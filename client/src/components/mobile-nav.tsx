import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Menu, X, Home, Box, Code, FileText, Coins, Search as SearchIcon, Sparkles, TrendingUp, ArrowUpRight, ArrowLeftRight, Droplets, ArrowUpDown, ImageIcon, PieChart, History, Rocket, LineChart, Webhook, Palette } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/wallet", label: "Wallet", icon: Coins, badge: "New" },
  { href: "/ecosystem", label: "Ecosystem", icon: Box },
  { href: "/swap", label: "Swap", icon: ArrowUpDown, badge: "DeFi" },
  { href: "/faucet", label: "Faucet", icon: Droplets },
  { href: "/launchpad", label: "Launchpad", icon: Rocket },
  { href: "/liquidity", label: "Liquidity", icon: Droplets },
  { href: "/nft", label: "NFT Market", icon: ImageIcon },
  { href: "/nft-gallery", label: "NFT Gallery", icon: ImageIcon },
  { href: "/nft-creator", label: "NFT Creator", icon: Palette },
  { href: "/portfolio", label: "Portfolio", icon: PieChart },
  { href: "/transactions", label: "History", icon: History },
  { href: "/charts", label: "Charts", icon: LineChart },
  { href: "/staking", label: "Staking", icon: TrendingUp },
  { href: "/bridge", label: "Bridge", icon: ArrowLeftRight },
  { href: "/token", label: "Token", icon: Coins },
  { href: "/explorer", label: "Explorer", icon: SearchIcon },
  { href: "/developers", label: "Developers", icon: Code },
  { href: "/webhooks", label: "Webhooks", icon: Webhook },
  { href: "/studio", label: "Dev Studio", icon: Sparkles },
];

function MenuPanel({ onClose }: { onClose: () => void }) {
  const [location] = useLocation();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return createPortal(
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(4px)',
          zIndex: 9998,
        }}
      />
      {/* Menu Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '288px',
          backgroundColor: '#080c18',
          background: '#080c18',
          zIndex: 9999,
          borderLeft: '1px solid rgba(255,255,255,0.1)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <span style={{ fontWeight: 700, fontSize: '20px', color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif' }}>Menu</span>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Nav Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            const comingSoon = 'comingSoon' in item && (item as any).comingSoon;
            const isExternal = 'external' in item && item.external;
            
            const content = (
              <div
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: isActive ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
                  color: isActive ? '#00ffff' : '#a1a1aa',
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
              >
                <Icon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                <span style={{ fontWeight: 500, flex: 1, fontFamily: 'Inter, sans-serif' }}>{item.label}</span>
                {'badge' in item && (item as any).badge && (
                  <Badge className="text-[9px] bg-pink-500/20 text-pink-400 px-1.5 py-0">
                    {(item as any).badge}
                  </Badge>
                )}
                {comingSoon && (
                  <Badge variant="outline" className="text-[10px] border-primary/50 text-primary px-1.5 py-0">
                    Soon
                  </Badge>
                )}
                {isExternal && (
                  <ArrowUpRight style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.4)' }} />
                )}
              </div>
            );
            
            if (isExternal) {
              return (
                <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  {content}
                </a>
              );
            }
            
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                {content}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Button */}
        <div style={{ marginTop: 'auto' }}>
          <Link href="/ecosystem" style={{ textDecoration: 'none' }}>
            <Button
              className="w-full bg-primary text-background hover:bg-primary/90 font-semibold"
              onClick={onClose}
            >
              Launch App
            </Button>
          </Link>
        </div>
      </div>
    </>,
    document.body
  );
}

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

      {mounted && isOpen && <MenuPanel onClose={() => setIsOpen(false)} />}
    </div>
  );
}
