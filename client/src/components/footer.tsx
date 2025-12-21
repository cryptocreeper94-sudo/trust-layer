import { Link } from "wouter";
import { Users, Github, Twitter, ExternalLink } from "lucide-react";
import { APP_VERSION } from "@shared/schema";

export function Footer() {
  return (
    <footer className="bg-black/80 backdrop-blur-xl border-t border-white/10 mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-white">DarkWave Chain</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The next generation blockchain ecosystem. Faster, more secure, and built for the future.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/ecosystem" className="hover:text-primary transition-colors">Ecosystem</Link></li>
              <li><Link href="/token" className="hover:text-primary transition-colors">Token</Link></li>
              <li><Link href="/explorer" className="hover:text-primary transition-colors">Block Explorer</Link></li>
              <li><Link href="/treasury" className="hover:text-primary transition-colors">Treasury</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Developers</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/developers" className="hover:text-primary transition-colors">Getting Started</Link></li>
              <li><Link href="/doc-hub" className="hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link href="/api-playground" className="hover:text-primary transition-colors">API Playground</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Connect</h4>
            <div className="flex gap-3">
              <a href="https://github.com/darkwavestudios" target="_blank" rel="noopener noreferrer" 
                 className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors group">
                <Github className="w-5 h-5 text-muted-foreground group-hover:text-white" />
              </a>
              <a href="https://twitter.com/darkwavestudios" target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors group">
                <Twitter className="w-5 h-5 text-muted-foreground group-hover:text-white" />
              </a>
              <a href="https://darkwavestudios.io" target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors group">
                <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-white" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Powered by</span>
            <span className="font-semibold text-white">DarkWave Studios LLC</span>
            <span className="mx-2">•</span>
            <span>© 2025</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="px-2 py-1 rounded bg-white/5 font-mono text-xs">v{APP_VERSION}</span>
            <Link href="/developer-portal" className="hover:text-primary transition-colors flex items-center gap-1">
              <Users className="w-4 h-4" />
              Team
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
