import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

function getManifestForDomain(): string {
  const host = window.location.hostname.toLowerCase();
  if (host.includes("darkwavegames") || host.includes("games.")) {
    return "/manifest-games.webmanifest";
  }
  if (host.includes("yourlegacy") || host === "yourlegacy.io" || host === "www.yourlegacy.io") {
    return "/manifest-chrono.webmanifest";
  }
  if (host.includes("chronochat") || host === "chronochat.io" || host === "www.chronochat.io") {
    return "/manifest-chronochat.webmanifest";
  }
  if (host.includes("trustshield") || host === "trustshield.tech" || host === "www.trustshield.tech") {
    return "/manifest-trustshield.webmanifest";
  }
  return "/manifest-dwsc.webmanifest";
}

function getThemeColorForDomain(): string {
  const host = window.location.hostname.toLowerCase();
  if (host.includes("darkwavegames") || host.includes("games.")) {
    return "#ec4899";
  }
  if (host.includes("yourlegacy") || host === "yourlegacy.io" || host === "www.yourlegacy.io") {
    return "#a855f7";
  }
  if (host.includes("chronochat") || host === "chronochat.io" || host === "www.chronochat.io") {
    return "#06b6d4";
  }
  if (host.includes("trustshield") || host === "trustshield.tech" || host === "www.trustshield.tech") {
    return "#06b6d4";
  }
  return "#00ffff";
}

const manifestLink = document.querySelector('link[rel="manifest"]');
if (manifestLink) {
  manifestLink.setAttribute("href", getManifestForDomain());
}

const themeColorMeta = document.querySelector('meta[name="theme-color"]');
if (themeColorMeta) {
  themeColorMeta.setAttribute("content", getThemeColorForDomain());
}

function updateDomainAssets() {
  const host = window.location.hostname.toLowerCase();

  if (host.includes("darkwavegames") || host.includes("games.")) {
    const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (appleTouchIcon) {
      appleTouchIcon.setAttribute("href", "/icons/games-icon-512.png");
    }
    document.title = "DarkWave Games - Play & Win";

    const existingSplash = document.querySelectorAll('link[rel="apple-touch-startup-image"]');
    existingSplash.forEach(el => el.remove());
    const splashScreens = [
      { href: "/splash/games-splash-1290x2796.png", media: "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)" },
      { href: "/splash/games-splash-1290x2796.png", media: "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)" },
      { href: "/splash/games-splash-1290x2796.png", media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" },
      { href: "/splash/games-splash-1290x2796.png", media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" },
    ];
    splashScreens.forEach(({ href, media }) => {
      const link = document.createElement("link");
      link.rel = "apple-touch-startup-image";
      link.href = href;
      link.media = media;
      document.head.appendChild(link);
    });
  }

  if (host.includes("trustshield") || host === "trustshield.tech" || host === "www.trustshield.tech") {
    const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (appleTouchIcon) {
      appleTouchIcon.setAttribute("href", "/icons/trustshield-192.png");
    }
    document.title = "TrustShield - AI Agent Certification";

    const splashScreens = [
      { href: "/splash/trustshield-splash-1290x2796.png", media: "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)" },
      { href: "/splash/trustshield-splash-1179x2556.png", media: "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)" },
      { href: "/splash/trustshield-splash-1242x2688.png", media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" },
      { href: "/splash/trustshield-splash-1125x2436.png", media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" },
      { href: "/splash/trustshield-splash-1080x1920.png", media: "(device-width: 360px) and (device-height: 640px) and (-webkit-device-pixel-ratio: 3)" },
      { href: "/splash/trustshield-splash-828x1792.png", media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" },
      { href: "/splash/trustshield-splash-750x1334.png", media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" },
      { href: "/splash/trustshield-splash-2048x1536.png", media: "(device-width: 1024px) and (device-height: 768px) and (-webkit-device-pixel-ratio: 2)" },
    ];
    const existingSplash = document.querySelectorAll('link[rel="apple-touch-startup-image"]');
    existingSplash.forEach(el => el.remove());
    splashScreens.forEach(({ href, media }) => {
      const link = document.createElement("link");
      link.rel = "apple-touch-startup-image";
      link.href = href;
      link.media = media;
      document.head.appendChild(link);
    });
  }
}
updateDomainAssets();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration.scope);
      })
      .catch((error) => {
        console.log('SW registration failed:', error);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
