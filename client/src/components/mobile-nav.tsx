import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Menu, X, Home, Box, Code, FileText, Coins, Search as SearchIcon, Sparkles, TrendingUp, ArrowUpRight, ArrowLeftRight, Droplets, ArrowUpDown, ImageIcon, PieChart, History, Rocket, LineChart, Webhook, Palette, Shield, Heart, Gamepad2, Star, Zap, Globe, ChevronDown, ChevronRight, Layers, Gift, Users } from "lucide-react";
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

// Organized nav categories for cleaner menu
const navCategories = [
  {
    label: "Essentials",
    icon: Home,
    defaultOpen: true,
    items: [
      { href: "/", label: "Home", icon: Home },
      { href: "/wallet", label: "Wallet", icon: Coins },
      { href: "/ecosystem", label: "Ecosystem", icon: Box },
      { href: "/arcade", label: "Games", icon: Rocket, badge: "Hot" },
    ]
  },
  {
    label: "DeFi",
    icon: TrendingUp,
    items: [
      { href: "/swap", label: "Swap", icon: ArrowUpDown, badge: "DeFi" },
      { href: "/staking", label: "Staking", icon: TrendingUp },
      { href: "/liquid-staking", label: "Liquid Staking", icon: TrendingUp },
      { href: "/liquidity", label: "Liquidity", icon: Droplets },
      { href: "/bridge", label: "Bridge", icon: ArrowLeftRight },
      { href: "/launchpad", label: "Launchpad", icon: Rocket },
    ]
  },
  {
    label: "NFTs",
    icon: ImageIcon,
    items: [
      { href: "/nft", label: "Marketplace", icon: ImageIcon },
      { href: "/nft-gallery", label: "Gallery", icon: Layers },
      { href: "/nft-creator", label: "Creator", icon: Palette },
    ]
  },
  {
    label: "Portfolio",
    icon: PieChart,
    items: [
      { href: "/portfolio", label: "Dashboard", icon: PieChart },
      { href: "/transactions", label: "History", icon: History },
      { href: "/charts", label: "Charts", icon: LineChart },
    ]
  },
  {
    label: "Blockchain",
    icon: Box,
    items: [
      { href: "/token", label: "DWC Coin", icon: Coins },
      { href: "/genesis", label: "Genesis Block", icon: Star },
      { href: "/explorer", label: "Explorer", icon: SearchIcon },
      { href: "/network", label: "Network", icon: TrendingUp },
      { href: "/validators", label: "Validators", icon: FileText },
      { href: "/faucet", label: "Faucet", icon: Droplets },
    ]
  },
  {
    label: "Developers",
    icon: Code,
    items: [
      { href: "/developers", label: "Docs", icon: Code },
      { href: "/studio", label: "Dev Studio", icon: Sparkles },
      { href: "/webhooks", label: "Webhooks", icon: Webhook },
    ]
  },
  {
    label: "Rewards",
    icon: Gift,
    items: [
      { href: "/founder-program", label: "Founders", icon: Sparkles, badge: "VIP" },
      { href: "/validators", label: "Become a Validator", icon: Shield, badge: "Earn" },
      { href: "/quests", label: "Quests", icon: Rocket },
      { href: "/airdrop", label: "Airdrop", icon: Coins },
      { href: "/domains", label: "Domains", icon: Globe, badge: "New" },
    ]
  },
  {
    label: "Community",
    icon: Users,
    items: [
      { href: "/community", label: "Hub", icon: Users, badge: "Soon" },
      { href: "/referrals", label: "Referrals", icon: Gift },
    ]
  },
  {
    label: "Security",
    icon: Shield,
    items: [
      { href: "/security", label: "Overview", icon: Shield },
      { href: "/guardian-certification", label: "Guardian Certification", icon: Shield, badge: "New" },
      { href: "/guardian-portal", label: "Guardian Portal", icon: Shield },
    ]
  },
  {
    label: "About",
    icon: Star,
    items: [
      { href: "/executive-summary", label: "Investors", icon: Star, badge: "New" },
      { href: "/roadmap", label: "Roadmap", icon: Star },
    ]
  },
];

function NavCategory({ category, location, onClose }: { 
  category: typeof navCategories[0]; 
  location: string; 
  onClose: () => void;
}) {
  const [isOpen, setIsOpen] = useState(category.defaultOpen || false);
  const Icon = category.icon;
  const hasActiveItem = category.items.some(item => location === item.href);
  
  return (
    <div style={{ marginBottom: '4px' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          gap: '12px',
          padding: '10px 12px',
          borderRadius: '10px',
          backgroundColor: hasActiveItem ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
          color: hasActiveItem ? '#a855f7' : '#a1a1aa',
          cursor: 'pointer',
          border: 'none',
          textAlign: 'left',
        }}
        data-testid={`nav-category-${category.label.toLowerCase()}`}
      >
        <Icon style={{ width: '18px', height: '18px', flexShrink: 0 }} />
        <span style={{ fontWeight: 600, flex: 1, fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>{category.label}</span>
        {isOpen ? (
          <ChevronDown style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.4)' }} />
        ) : (
          <ChevronRight style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.4)' }} />
        )}
      </button>
      
      {isOpen && (
        <div style={{ marginLeft: '16px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {category.items.map((item) => {
            const ItemIcon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <div
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: isActive ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
                    color: isActive ? '#00ffff' : '#a1a1aa',
                    cursor: 'pointer',
                  }}
                  data-testid={`nav-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <ItemIcon style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                  <span style={{ fontWeight: 500, flex: 1, fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>{item.label}</span>
                  {'badge' in item && (item as any).badge && (
                    <Badge className="text-[9px] bg-pink-500/20 text-pink-400 px-1.5 py-0">
                      {(item as any).badge}
                    </Badge>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
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

        {/* Social Links */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <a href="https://x.com/coin_solma41145" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s' }} data-testid="mobile-social-twitter">
            <svg viewBox="0 0 24 24" style={{ width: '22px', height: '22px', fill: 'currentColor' }}>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a href="https://discord.gg/PtkWpzE6" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s' }} data-testid="mobile-social-discord">
            <svg viewBox="0 0 24 24" style={{ width: '22px', height: '22px', fill: 'currentColor' }}>
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </a>
          <a href="https://t.me/dwsccommunity" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s' }} data-testid="mobile-social-telegram">
            <svg viewBox="0 0 24 24" style={{ width: '22px', height: '22px', fill: 'currentColor' }}>
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
          </a>
          <a href="https://www.facebook.com/profile.php?id=61585553137979" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s' }} data-testid="mobile-social-facebook">
            <svg viewBox="0 0 24 24" style={{ width: '22px', height: '22px', fill: 'currentColor' }}>
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
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
                  onClick={item.external ? undefined : onClose}
                  data-testid={`featured-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  style={{
                    position: 'relative',
                    padding: '14px',
                    borderRadius: '16px',
                    border: isActive ? '2px solid rgba(168, 85, 247, 0.6)' : '1px solid rgba(255, 255, 255, 0.2)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    minHeight: '70px',
                    boxSizing: 'border-box',
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative', zIndex: 1 }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      minWidth: '38px',
                      borderRadius: '10px',
                      background: `linear-gradient(135deg, ${item.iconGradient})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                      flexShrink: 0,
                    }}>
                      <Icon style={{ width: '18px', height: '18px', color: '#ffffff' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ marginBottom: '2px' }}>
                        <span style={{ fontWeight: 600, fontSize: '13px', color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{item.label}</span>
                        <Badge className={`text-[9px] px-1 py-0 ml-2 ${item.badgeClass}`}>
                          {item.badge}
                        </Badge>
                      </div>
                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{item.description}</span>
                    </div>
                  </div>
                </div>
              );
              
              if (item.external) {
                return (
                  <a 
                    key={item.href} 
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    {cardContent}
                  </a>
                );
              }
              
              return (
                <Link key={item.href} href={item.href} style={{ textDecoration: 'none', display: 'block' }}>
                  {cardContent}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)', marginBottom: '16px' }} />

        {/* Nav Categories */}
        <nav style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {navCategories.map((category) => (
            <NavCategory 
              key={category.label} 
              category={category} 
              location={location} 
              onClose={onClose} 
            />
          ))}
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
  { href: "/security", label: "Security", icon: Shield },
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
        className="hover:bg-white/5 min-w-[48px] min-h-[48px] w-12 h-12"
        data-testid="button-mobile-menu"
      >
        <Menu className="w-8 h-8" />
      </Button>

      {mounted && isOpen && <MenuPanel onClose={() => setIsOpen(false)} />}
    </div>
  );
}
