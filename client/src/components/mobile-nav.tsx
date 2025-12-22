import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Box, Code, FileText, Coins, Search as SearchIcon, Sparkles, TrendingUp, ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/ecosystem", label: "Ecosystem", icon: Box },
  { href: "/developers", label: "Developers", icon: Code },
  { href: "/doc-hub", label: "Doc Hub", icon: FileText },
  { href: "/token", label: "Token", icon: Coins },
  { href: "https://darkwavepulse.com", label: "Staking", icon: TrendingUp, external: true },
  { href: "/explorer", label: "Explorer", icon: SearchIcon },
  { href: "/dev-studio", label: "Dev Studio", icon: Sparkles, comingSoon: true },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="hover:bg-white/5 min-w-[44px] min-h-[44px]"
        data-testid="button-mobile-menu"
      >
        <Menu className="w-6 h-6" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99]"
              onClick={() => setIsOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '288px',
                backgroundColor: '#080c18',
                background: '#080c18',
                zIndex: 100,
                borderLeft: '1px solid rgba(255,255,255,0.1)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '20px', color: 'white' }}>Menu</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href;
                  const comingSoon = 'comingSoon' in item && item.comingSoon;
                  const isExternal = 'external' in item && item.external;
                  
                  const buttonContent = (
                    <button
                      onClick={() => setIsOpen(false)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: 'none',
                        background: isActive ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
                        color: isActive ? '#00ffff' : '#a1a1aa',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'left',
                      }}
                    >
                      <Icon style={{ width: '20px', height: '20px' }} />
                      <span style={{ fontWeight: 500, flexGrow: 1, textAlign: 'left' }}>{item.label}</span>
                      {comingSoon && (
                        <Badge variant="outline" className="text-[10px] border-primary/50 text-primary px-1.5 py-0">
                          Soon
                        </Badge>
                      )}
                      {isExternal && (
                        <ArrowUpRight style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.4)' }} />
                      )}
                    </button>
                  );
                  
                  if (isExternal) {
                    return (
                      <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer">
                        {buttonContent}
                      </a>
                    );
                  }
                  
                  return (
                    <Link key={item.href} href={item.href}>
                      {buttonContent}
                    </Link>
                  );
                })}
              </nav>

              <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
                <Link href="/ecosystem">
                  <Button
                    className="w-full bg-primary text-background hover:bg-primary/90 font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    Launch App
                  </Button>
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
