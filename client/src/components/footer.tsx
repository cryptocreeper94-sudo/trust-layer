import { APP_VERSION } from "@shared/schema";

export function Footer() {
  return (
    <footer className="bg-black/80 backdrop-blur-xl border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="font-semibold text-white">DarkWave Studios, LLC</span>
          <span>© 2025</span>
          <span className="px-2 py-0.5 rounded bg-white/5 font-mono">v{APP_VERSION}</span>
        </div>
      </div>
    </footer>
  );
}
