import { useState } from "react";
import { APP_VERSION } from "@shared/schema";
import { useLocation, Link } from "wouter";

const socialLinks = [
  {
    name: "Twitter",
    url: "https://x.com/coin_solma41145",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "Discord",
    url: "https://discord.gg/PtkWpzE6",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  {
    name: "Telegram",
    url: "https://t.me/dwsccommunity",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/profile.php?id=61585553137979",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

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
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/30 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
                  data-testid={`link-social-${social.name.toLowerCase()}`}
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <span className="text-white/20">|</span>
            <span className="font-semibold text-white">DarkWave Studios, LLC</span>
            <span>© 2025-2026</span>
            <span className="px-2 py-0.5 rounded bg-white/5 font-mono">v{APP_VERSION}</span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10">
              <svg viewBox="0 0 24 24" className="w-3 h-3 text-white/50" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <svg viewBox="0 0 24 24" className="w-3 h-3 text-white/50" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
              </svg>
              <span className="text-[10px] text-white/40">Apps Coming Soon</span>
            </span>
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
            <span className="text-white/20">|</span>
            <Link 
              href="/privacy"
              className="text-white/40 hover:text-cyan-400 transition-colors"
              data-testid="link-privacy"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms"
              className="text-white/40 hover:text-cyan-400 transition-colors"
              data-testid="link-terms"
            >
              Terms of Service
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
