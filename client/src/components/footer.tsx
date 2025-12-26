import { useState } from "react";
import { APP_VERSION } from "@shared/schema";
import { useLocation, Link } from "wouter";

export function Footer() {
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [, setLocation] = useLocation();

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "0424") {
      setShowPinModal(false);
      setPin("");
      setError(false);
      setLocation("/team");
    } else {
      setError(true);
      setPin("");
    }
  };

  return (
    <>
      <footer className="bg-black/80 backdrop-blur-xl border-t border-white/10 mt-auto">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="font-semibold text-white">DarkWave Studios, LLC</span>
            <span>© 2025</span>
            <span className="px-2 py-0.5 rounded bg-white/5 font-mono">v{APP_VERSION}</span>
            <Link 
              href="/presale"
              className="text-white/40 hover:text-cyan-400 transition-colors"
              data-testid="link-presale"
            >
              Presale
            </Link>
            <Link 
              href="/roadmap"
              className="text-white/40 hover:text-cyan-400 transition-colors"
              data-testid="link-roadmap"
            >
              Roadmap
            </Link>
            <Link 
              href="/roadmap-chronicles"
              className="text-white/40 hover:text-purple-400 transition-colors"
              data-testid="link-roadmap-chronicles"
            >
              Chronicles
            </Link>
            <button 
              onClick={() => setShowPinModal(true)}
              className="text-white/30 hover:text-white/60 transition-colors"
              data-testid="link-team"
            >
              Team
            </button>
            <Link 
              href="/admin"
              className="text-white/20 hover:text-amber-400 transition-colors"
              data-testid="link-admin"
            >
              Admin
            </Link>
          </div>
        </div>
      </footer>

      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowPinModal(false)}>
          <div className="bg-[rgba(12,18,36,0.95)] border border-white/10 rounded-xl p-6 w-full max-w-xs" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4 text-center">Team Access</h3>
            <form onSubmit={handlePinSubmit}>
              <input
                type="password"
                value={pin}
                onChange={(e) => { setPin(e.target.value); setError(false); }}
                placeholder="Enter PIN"
                maxLength={4}
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-center text-xl tracking-widest font-mono mb-3"
                autoFocus
                data-testid="input-team-pin"
              />
              {error && <p className="text-red-400 text-xs text-center mb-3">Invalid PIN</p>}
              <button
                type="submit"
                className="w-full py-2 bg-primary text-background font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                data-testid="button-team-submit"
              >
                Access
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
