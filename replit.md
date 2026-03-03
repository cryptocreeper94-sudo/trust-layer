# Trust Layer - Replit Agent Guide

## Overview
Trust Layer is a high-performance Layer 1 Proof-of-Authority (PoA) blockchain ecosystem, referred to as the Coordinated Trust Layer. Its primary goal is to provide verified identity, accountability, and transparent audit trails for real business operations. The project includes the Trust Layer Portal (a React web application) and "Chronicles" (a life simulation game). The ecosystem aims to deliver a fast, feature-rich trust infrastructure with a premium user experience and innovative gaming across various domains, offering a comprehensive, premium, and innovative trust-based ecosystem.

## User Preferences
- Preferred communication style: Simple, everyday language
- User wants: Full blockchain implementation, not just a web portal. No piggybacking on other chains.
- Design: Premium UI with extensive visual effects ("everything should sparkle and shine")
- Mobile: Mobile-first design with self-contained carousels, accordions, dropdowns
- Branding: White-labeled, no Replit branding, dark theme only
- Stripe: FULLY CONFIGURATED - do not ask about Stripe keys, payments are ready
- App Store Target: Build for eventual React Native + Expo port - iOS App Store & Google Play as standalone ecosystem apps
- Signal (SIG) is a NATIVE ASSET — NEVER call it a "token" or "cryptocurrency." It is the native currency of the Trust Layer chain, like ETH is to Ethereum or SOL is to Solana.

## System Architecture

### UI/UX Decisions
The UI/UX emphasizes a "MANDATORY PREMIUM UI PROTOCOL" with a dark theme and polished aesthetics.
- **Layout**: True Bento Grid (3-Column) with responsive adjustments.
- **Glassmorphism**: All cards use `<GlassCard glow>` with semi-transparent backgrounds, `backdrop-blur-xl`, and subtle borders.
- **Visual Effects**: Extensive use of `glow` props, hover effects, `shadow-2xl`, and Framer Motion for interactive elements.
- **Spacing**: Consistent padding and margins for visual clarity.
- **Mobile-First**: Responsive design, 44px minimum touch targets, and responsive font sizes.
- **Interactive Components**: Swiper/carousels, Accordion, and collapsible drawers.
- **Animations**: `motion.div` for page transitions, staggered animations, and gradient text.
- **Color Palette**: Exclusively dark theme with primary, secondary, and accent colors, and various white text shades.
- **Component Standards**: Required `GlassCard` with `glow`, `Badge`, UI library `Button`, `motion.div` wrapper, and `data-testid` on interactive elements.

### Technical Implementations
- **Blockchain Core**: BFT-PoA consensus, stake-weighted validators, PostgreSQL state, SHA-256/Merkle trees, 400ms block time, 200K+ TPS. Includes validator staking, slashing, epoch-based finality, node sync APIs, and native asset Signal (SIG).
- **Web Portal Frontend**: React 18, TypeScript, Vite, Wouter, TanStack Query, Tailwind CSS v4, Framer Motion.
- **Web Portal Backend**: Node.js, Express.js, TypeScript, Drizzle ORM, PostgreSQL.
- **Authentication**: Custom email/password, Resend email verification, Twilio SMS, WebAuthn/Passkeys, PIN. Session-based with Bearer token.
- **Multi-PWA**: Host-based routing for ecosystem domains.
- **DeFi Features**: Testnet Faucet, AMM-style DEX/Token Swap, NFT Marketplace & Gallery, Portfolio Dashboard, Transaction History, Token Launchpad, Liquidity Pools, NFT Creator Tool, Price Charts (Recharts), Webhook/Events API, Liquid Staking (stSIG).
- **Cross-Chain Bridge**: Lock & mint mechanism for SIG ↔ wSIG across Ethereum (Sepolia), Solana (Devnet), Polygon (Amoy), Arbitrum (Sepolia), Base (Sepolia).
- **DarkWave Chronicles**: Life simulation game with real-time gameplay, AI-generated personalized situations, persistent NPCs, and educational themes. Includes a "Faith & Spiritual Life System." Features a 3D engine built with React Three Fiber, supporting three eras (Modern/Medieval/Wild West) and 19 location configurations.
- **Guardian Suite**: AI security verification (Scanner), DEX screener (Screener), blockchain security audit (Certification Program), and continuous monitoring (Shield).
- **Trust Book**: Premium ebook publishing and reading platform with a 5-tab interface. Features include an AI Book Author Agent, author publishing portal with 70% royalty, blockchain-verified provenance, and an author payout system using Stripe Connect Express.
- **Launch Countdown**: Master launch roadmap at `/launch` with a target date of August 23, 2026. Includes a real-time countdown, 6-phase checklist, and prominent branding.
- **Unified Transaction Tracking**: Every Stripe purchase logged to `user_transactions` with a SHA-256 blockchain tx hash, displayed in `/my-hub`.
- **My Hub / User Portal**: Personalized user portal displaying member number, explorer address, Signal Allocation, shell balance, and transaction history.
- **Ecosystem Infrastructure**: Credits System, Owner Admin Portal, Marketing Automation, Payment Infrastructure, Pre-Launch Airdrop, Signal Chat, Shells Economy, Subscription System, Early Adopter Rewards, Backend IDE.
- **Innovation Hub Features**: Guardian Security Scores, ChronoPass Identity, Experience Shards, Quest Mining System, Zealy Integration, Reality Layer Oracles, AI Verified Execution, Guardian Studio Copilot, AI Agent Marketplace, RWA Tokenization.
- **Web Presence**: Trust Layer Landing Page, Strategic Marketing Pages, Business Tenant Portals, DarkWave Academy, Blockchain Domain Service (.tlid).
- **Inter-Ecosystem**: Multi-SIG Multi-Chain Wallet, Ecosystem SSO, Ecosystem Credential Sync, TrustVault Blockchain Integration API (HMAC-authenticated REST endpoints for identity, media provenance, trust engine, and Signal assets).
- **Security**: Helmet.js, CORS, rate limiting, AES-256-GCM, HMAC-SHA256, parameterized SQL.
- **React Native Portability**: Guidelines for shared business logic, data fetching with TanStack Query, React hooks, NativeWind for styling, and separation of logic from presentation.

### Ecosystem Domains & Subdomains
The ecosystem spans 32 verified applications across primary domains including `dwsc.io`, `darkwavegames.io`, `darkwavestudios.io`, `yourlegacy.io`, `tlid.io`, `trustshield.tech`, and `intothevoid.app`, as well as various external and internal PWA routes.

### Tokenomics
- **Native Asset**: Signal (SIG), Total Supply: 1,000,000,000 SIG.
- **Pre-launch Currency**: Shells (1 Shell = $0.001, converts to SIG).
- **In-game Currency**: Echo (1 Echo = $0.0001, not convertible; 10 Echoes = 1 Shell).
- **Allocation**: Treasury (50%), Staking Rewards (15%), Development & Team (15%), Ecosystem Growth (10%), Community Rewards (10%).
- **Referral System**: Multiplier-based Shell rewards with automated payouts.

### Embeddable Ecosystem Widget & Shared Components
An embeddable widget allows any app to display ecosystem apps, presale stats, and user data via a single script tag. A shared UI system enables loading standardized components (footer, announcement bar, trust badge) via another script tag.

## External Dependencies
- **Database**: PostgreSQL
- **Authentication**: Custom (no Firebase dependency)
- **Payments**: Stripe
- **AI**: OpenAI GPT-4o
- **Email Verification**: Resend
- **SMS Verification**: Twilio