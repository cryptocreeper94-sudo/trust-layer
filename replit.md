# DarkWave Trust Layer - Replit Agent Guide

## Overview
DarkWave Trust Layer (DWTL) is a high-performance Layer 1 Proof-of-Authority (PoA) blockchain ecosystem designed as a Coordinated Trust Layer. Its purpose is to provide verified identity, accountability, and transparent audit trails for real business operations, moving beyond traditional blockchain focuses. The project includes the DarkWave Portal, a comprehensive React web application, and "DarkWave Chronicles," a fantasy-themed game focused on a living political simulation. The core ambition is to deliver a fast, feature-rich trust infrastructure with a premium user experience and innovative gaming across six key domains: dwsc.io, darkwavegames.io, darkwavestudios.io, yourlegacy.io, tlid.io, and trustshield.tech.

## User Preferences
- Preferred communication style: Simple, everyday language
- User wants: Full blockchain implementation, not just a web portal. No piggybacking on other chains.
- Design: Premium UI with extensive visual effects ("everything should sparkle and shine")
- Mobile: Mobile-first design with self-contained carousels, accordions, dropdowns
- Branding: White-labeled, no Replit branding, dark theme only
- Stripe: FULLY CONFIGURATED - do not ask about Stripe keys, payments are ready
- App Store Target: Build for eventual React Native + Expo port - iOS App Store & Google Play as standalone ecosystem apps

## System Architecture

### UI/UX Decisions - MANDATORY PREMIUM UI PROTOCOL
- **Layout**: True Bento Grid (3-Column) with `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` for desktop, `gap-4` minimum, and `container mx-auto px-4 sm:px-6 lg:px-8`.
- **Glassmorphism**: Every card uses `<GlassCard glow>` with `bg-slate-900/50` or `bg-white/5`, `backdrop-blur-xl`, `border border-white/10`, and `p-4 sm:p-6`.
- **Glow & 3D Effects**: `glow` prop on GlassCard, `hover:border-cyan-500/30` transitions, `shadow-2xl` or custom shadows, and Framer Motion for interactive card hovers.
- **Spacing & Padding**: Page padding `pt-20 pb-12`, section margins `mb-8`, card padding `p-4` minimum, ensuring text never touches edges.
- **Mobile-First Responsive**: Base styles for mobile, scaling up with `md:`, `lg:`, `xl:`, 44px minimum touch targets, and responsive font sizes.
- **Carousels & Accordions**: Swiper or custom carousels for horizontal content, Accordion component for expandable sections, and collapsible drawers for mobile navigation.
- **Animations & Polish**: `motion.div` for page entrances, staggered children animations, premium badges with glow effects, and gradient text for headlines.
- **Color Palette (DARK THEME ONLY)**: Backgrounds `bg-slate-950`, `bg-slate-900`; Primary Cyan, Secondary Purple, Accent Pink; Text `text-white` variations; Semantic colors for success, warning, error.
- **Component Requirements**: `GlassCard` with `glow`, `Badge`, UI library `Button`, `motion.div` wrapper, `data-testid` on all interactive elements.

### Technical Implementations
- **Blockchain Core**: BFT-PoA consensus, stake-weighted validator selection, PostgreSQL state, SHA-256/Merkle trees, 400ms block time, 200K+ TPS. Features validator staking, slashing, epoch-based finality, node sync APIs. Native asset: Signal (SIG) as a Trust Network Access Token.
- **Web Portal (Frontend)**: React 18, TypeScript, Vite, Wouter, TanStack Query, Tailwind CSS v4, Framer Motion.
- **Web Portal (Backend)**: Node.js, Express.js, TypeScript, Drizzle ORM, PostgreSQL.
- **Authentication**: Firebase Auth (multiple providers), server-side Firebase token verification, WebAuthn/Passkeys, PIN authentication.
- **Multi-PWA**: Host-based routing for ecosystem domains.
- **DeFi Features**: Testnet Faucet, AMM-style DEX/Token Swap, NFT Marketplace & Gallery, Portfolio Dashboard, Transaction History, Token Launchpad, Liquidity Pools, NFT Creator Tool, Price Charts (Recharts), Webhook/Events API, Liquid Staking (stSIG).
- **Cross-Chain Bridge**: Lock & mint mechanism for SIG ↔ wSIG across Ethereum (Sepolia), Solana (Devnet), Polygon (Amoy), Arbitrum (Sepolia), Base (Sepolia).
- **DarkWave Chronicles**: Parallel life simulation (NOT an RPG). You are YOU living in different eras. 1 hour = 1 real hour, timezone-synced. No pre-canned routes, no scripted morality - only moral guidance based on YOUR beliefs and choices. The world presents situations and you decide based on who you actually are. Players start in Modern era, unlock Medieval and Wild West eras through participation. Each player has a separate estate per era. World runs in real-time - other players and smart NPCs shape all eras even while you're away. 3D estate viewer with React Three Fiber. Season 0 has 3 playable eras (Modern, Medieval, Wild West) with 15 factions, 21 situations, 9 NPCs, 15 city zones, 36 era-specific building templates. NPCs are real people in your world, not quest-givers. Factions are communities you align with based on values, not classes.
- **Credits System**: Manages costs for AI chat, scenario generation, voice cloning, and personality summaries.
- **Owner Admin Portal**: Secure `/owner-admin` with `OWNER_SECRET` authentication, rate limiting, and lockout.
- **Marketing Automation System**: Proprietary auto-deployment for social media.
- **Payment Infrastructure**: Crowdfund donations and token presales with Stripe integration.
- **Pre-Launch Airdrop System**: Manages affiliate commissions, distributed as Signal, dual-ledger design.
- **Signal Chat Platform**: Cross-app community messaging with JWT SSO. Uses `chat_users`, `chat_channels`, `chat_messages` tables. Auth: bcryptjs 12 rounds, JWT HS256. WebSocket at `/ws/chat` for real-time communication.
- **Shells Economy System**: Pre-launch virtual currency, convertible to Signal, earned via engagement, purchased via Stripe, with atomic transactions.
- **Subscription System**: Unified subscription management with tiers and cross-app entitlement checking.
- **Guardian Certification Program**: In-house blockchain security audit service with tiered offerings and public registry. Offers Assurance Lite and Guardian Premier audits with a 5-phase process.
- **Guardian Shield (trustshield.tech)**: Continuous blockchain security monitoring for enterprises.
- **Guardian AI**: Certification system for autonomous AI agents across Security, Transparency, Reliability, and Compliance. Public registry at `/guardian-ai-registry`.
- **Security Infrastructure**: Helmet.js, CORS, rate limiting, AES-256-GCM, HMAC-SHA256, parameterized SQL.
- **Early Adopter Rewards System**: Tracks signup positions and tiered crowdfund bonuses for Signal airdrops.
- **Backend IDE / Studio Executor**: Docker container orchestration for code execution with JWT auth, sandboxing, and resource enforcement.
- **Innovation Hub Features**: Guardian Security Scores, ChronoPass Identity, Experience Shards, Quest Mining System, Zealy Integration, Reality Layer Oracles, AI Verified Execution, Guardian Studio Copilot, AI Agent Marketplace, RWA Tokenization.
- **Trust Layer Landing Page**: Main landing page (`/`) focused on individual signup, membership card benefits, ecosystem apps display, and business signup paths.
- **Strategic Marketing Pages**: Competitive Analysis (`/token-compare`), Investor Pitch (`/investor-pitch`), Innovation Hub (`/innovation`).
- **Business Tenant Portals**: Secure B2B dashboards with transaction ledgers, trusted networks, and API access. Requires personal account first and business verification.
- **Multi-SIG Multi-Chain Wallet**: M-of-N signature requirements across all supported chains for business treasuries and DAOs.
- **DarkWave Academy**: Education and certification platform for crypto fundamentals, multi-chain ecosystems, DeFi, security, bridging, and Trust Layer operations.
- **Blockchain Domain Service**: `.tlid` domains (Trust Layer ID) at `tlid.io` for blockchain-verified identity names.
- **Ecosystem SSO (Single Sign-On)**: Cross-app authentication for ecosystem apps via Trust Layer, using HMAC-SHA256 request signing and one-time tokens.
- **Ecosystem Credential Sync**: Behind-the-scenes user credential sync for ecosystem apps with independent login UIs, using email as a shared identifier and HMAC-SHA256 signed requests.

### React Native Portability Guidelines
- **Business Logic**: Located in `shared/` folder, platform-agnostic TypeScript.
- **Data Fetching**: TanStack Query patterns.
- **State Management**: React hooks and context.
- **Styling**: Tailwind concepts map to NativeWind.
- **Components**: Logic separate from presentation.
- **Avoid**: Direct DOM manipulation, web-only APIs in shared code.
- **Navigation**: Wouter patterns map to React Navigation.
- **Assets**: Use import paths.

### Tokenomics
- **SIG at TGE**: $0.01 (10x from presale $0.001)
- **Total Supply**: 1,000,000,000 SIG
- **Presale Reward Pool**: 10,000,000 SIG (1% of supply)
- **Shell Value**: 1 Shell = $0.001 (pre-launch currency, converts to SIG)
- **Echo Value**: 1 Echo = $0.0001 (Chronicles in-game currency, NOT convertible)
- **Conversion**: 10 Echoes = 1 Shell = 0.1 SIG
- **Allocation**: Treasury Reserve (50%), Staking Rewards (15%), Development & Team (15%), Ecosystem Growth (10%), Community Rewards (10%).

### Referral Rewards System
- **MULTIPLIER-BASED System**: Base 1,000 Shells per referral, with multipliers (1x, 3x, 5x, 7x, 10x) based on referred user's purchase amount ($0, $5+, $25+, $50+, $100+).
- **Payout Schedule**: Automated twice daily.
- **No Limits**: Unlimited referrals.
- **Business Partners**: 2.5x multiplier on all rewards.
- **Claim Window**: Wallet required before launch; 30 days after TGE to claim.

## External Dependencies
- **Database**: PostgreSQL
- **Authentication**: Firebase Auth
- **Payments**: Stripe, Coinbase Commerce
- **Hub API**: https://orbitstaffing.io
- **AI**: OpenAI GPT-4o
- **Social**: Twitter/X, Discord, Telegram, Facebook automation