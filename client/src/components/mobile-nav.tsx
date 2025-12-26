import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Menu, X, Home, Box, Code, FileText, Coins, Search as SearchIcon, Sparkles, TrendingUp, ArrowUpRight, ArrowLeftRight, Droplets, ArrowUpDown, ImageIcon, PieChart, History, Rocket, LineChart, Webhook, Palette, Shield, Heart, Gamepad2, Star, Zap } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import chroniclesImg from "@assets/generated_images/fantasy_sci-fi_world_landscape.png";
import crowdfundImg from "@assets/generated_images/futuristic_blockchain_network_activity_monitor.png";
import presaleImg from "@assets/generated_images/darkwave_crypto_token_coin_holographic.png";

const featuredItems = [
  { href: "https://yourlegacy.io", label: "DarkWave Chronicles", icon: Gamepad2, badge: "Game", image: chroniclesImg, overlayGradient: "linear-gradient(135deg, rgba(168,85,247,0.85) 0%, rgba(236,72,153,0.7) 50%, rgba(0,0,0,0.6) 100%)", iconGradient: "#a855f7, #ec4899", badgeClass: "bg-purple-500/30 text-purple-300", description: "Live Your Legacy", external: true },
  { href: "/crowdfund", label: "Fund Development", icon: Heart, badge: "Support", image: crowdfundImg, overlayGradient: "linear-gradient(135deg, rgba(6,182,212,0.85) 0%, rgba(59,130,246,0.7) 50%, rgba(0,0,0,0.6) 100%)", iconGradient: "#06b6d4, #3b82f6", badgeClass: "bg-cyan-500/30 text-cyan-300", description: "Help Build the Future", external: false },
  { href: "/presale", label: "Token Presale", icon: Coins, badge: "Live", image: presaleImg, overlayGradient: "linear-gradient(135deg, rgba(245,158,11,0.85) 0%, rgba(239,68,68,0.7) 50%, rgba(0,0,0,0.6) 100%)", iconGradient: "#f59e0b, #ef4444", badgeClass: "bg-amber-500/30 text-amber-300", description: "Get DWC at Best Price", external: false },
];

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/wallet", label: "Wallet", icon: Coins, badge: "New" },
  { href: "/arcade", label: "Games", icon: Rocket, badge: "Hot" },
  { href: "/ecosystem", label: "Ecosystem", icon: Box },
  { href: "/swap", label: "Swap", icon: ArrowUpDown, badge: "DeFi" },
  { href: "/faucet", label: "Faucet", icon: Droplets },
  { href: "/launchpad", label: "Launchpad", icon: Rocket },
  { href: "/liquidity", label: "Liquidity", icon: Droplets },
  { href: "/liquid-staking", label: "Liquid Staking", icon: TrendingUp },
  { href: "/nft", label: "NFT Market", icon: ImageIcon },
  { href: "/nft-gallery", label: "NFT Gallery", icon: ImageIcon },
  { href: "/nft-creator", label: "NFT Creator", icon: Palette },
  { href: "/portfolio", label: "Portfolio", icon: PieChart },
  { href: "/transactions", label: "History", icon: History },
  { href: "/charts", label: "Charts", icon: LineChart },
  { href: "/staking", label: "Staking", icon: TrendingUp },
  { href: "/bridge", label: "Bridge", icon: ArrowLeftRight },
  { href: "/token", label: "Coin", icon: Coins },
  { href: "/explorer", label: "Explorer", icon: SearchIcon },
  { href: "/network", label: "Network Stats", icon: TrendingUp },
  { href: "/validators", label: "Validators", icon: FileText },
  { href: "/developers", label: "Developers", icon: Code },
  { href: "/webhooks", label: "Webhooks", icon: Webhook },
  { href: "/studio", label: "Dev Studio", icon: Sparkles },
  { href: "/founder-program", label: "Founders", icon: Sparkles, badge: "VIP" },
  { href: "/quests", label: "Quests", icon: Rocket },
  { href: "/airdrop", label: "Airdrop", icon: Coins },
  { href: "/roadmap", label: "Roadmap", icon: Star },
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
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

        {/* Featured Section */}
        <div style={{ marginBottom: '24px' }}>
          <span style={{ 
            fontSize: '11px', 
            fontWeight: 600, 
            color: '#a855f7', 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em',
            marginBottom: '12px',
            display: 'block'
          }}>
            Featured
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {featuredItems.map((item) => {
              const Icon = item.icon;
              const isActive = !item.external && location === item.href;
              
              const cardContent = (
                <div
                  onClick={onClose}
                  data-testid={`featured-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  style={{
                    position: 'relative',
                    padding: '16px',
                    borderRadius: '16px',
                    border: isActive ? '2px solid rgba(168, 85, 247, 0.6)' : '1px solid rgba(255, 255, 255, 0.2)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                >
                  <img 
                    src={item.image} 
                    alt=""
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }}
                  />
                  <div style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    background: item.overlayGradient,
                    pointerEvents: 'none'
                  }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 1 }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: `linear-gradient(135deg, ${item.iconGradient})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                      backdropFilter: 'blur(8px)',
                    }}>
                      <Icon style={{ width: '22px', height: '22px', color: '#ffffff' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 600, fontSize: '14px', color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{item.label}</span>
                        <Badge className={`text-[9px] px-1.5 py-0 ${item.badgeClass}`}>
                          {item.badge}
                        </Badge>
                      </div>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{item.description}</span>
                    </div>
                    {item.external ? (
                      <ArrowUpRight style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.6)' }} />
                    ) : (
                      <Zap style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.6)' }} />
                    )}
                  </div>
                </div>
              );
              
              return item.external ? (
                <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  {cardContent}
                </a>
              ) : (
                <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                  {cardContent}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)', marginBottom: '16px' }} />

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

// Primary links shown in desktop nav bar
const primaryNavItems = [
  { href: "/wallet", label: "Wallet", icon: Coins },
  { href: "/swap", label: "Swap", icon: ArrowUpDown },
  { href: "/token", label: "Coin", icon: Coins },
  { href: "/explorer", label: "Explorer", icon: SearchIcon },
  { href: "/staking", label: "Staking", icon: TrendingUp },
  { href: "/developers", label: "Developers", icon: Code },
];

export function DesktopNav() {
  const [location] = useLocation();
  
  return (
    <nav className="hidden lg:flex items-center gap-1">
      {primaryNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = location === item.href;
        
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 px-3 text-xs gap-1.5 ${isActive ? 'bg-white/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div>
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
