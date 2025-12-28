import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

function getManifestForDomain(): string {
  const host = window.location.hostname.toLowerCase();
  if (host.includes("darkwavegames") || host.includes("games.")) {
    return "/manifest-games.webmanifest";
  }
  if (host.includes("darkwavestudios") || host.includes("studios.")) {
    return "/manifest-studios.webmanifest";
  }
  if (host.includes("yourlegacy") || host === "yourlegacy.io" || host === "www.yourlegacy.io") {
    return "/manifest-chrono.webmanifest";
  }
  if (host.includes("chronochat") || host === "chronochat.io" || host === "www.chronochat.io") {
    return "/manifest-chronochat.webmanifest";
  }
  return "/manifest-dwsc.webmanifest";
}

function getThemeColorForDomain(): string {
  const host = window.location.hostname.toLowerCase();
  if (host.includes("darkwavegames") || host.includes("games.")) {
    return "#ec4899";
  }
  if (host.includes("darkwavestudios") || host.includes("studios.")) {
    return "#06b6d4";
  }
  if (host.includes("yourlegacy") || host === "yourlegacy.io" || host === "www.yourlegacy.io") {
    return "#a855f7";
  }
  if (host.includes("chronochat") || host === "chronochat.io" || host === "www.chronochat.io") {
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
