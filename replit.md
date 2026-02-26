# Trust Layer - Replit Agent Guide

## Overview
Trust Layer is a high-performance Layer 1 Proof-of-Authority (PoA) blockchain ecosystem, envisioned as a Coordinated Trust Layer. Its core purpose is to provide verified identity, accountability, and transparent audit trails for real business operations. The project includes the Trust Layer Portal (a React web application) and "Chronicles" (a unique life simulation game). The ecosystem delivers a fast, feature-rich trust infrastructure with a premium user experience and innovative gaming across key domains such as dwsc.io, darkwavegames.io, darkwavestudios.io, yourlegacy.io, tlid.io, trustshield.tech, and intothevoid.app. The overarching goal is to offer a comprehensive, premium, and innovative trust-based ecosystem.

## Branding Rules
- **"Trust Layer"** for all ecosystem branding and user-facing text
- **"DarkWave Studios"** ONLY for company/legal entity references (the parent company)
- **"The Arcade"** for the gaming portal at darkwavegames.io (NOT "DarkWave Games")
- **"Academy"** for the education platform (NOT "DarkWave Academy")
- **"Chronicles"** for the life simulation game (NOT "DarkWave Chronicles")
- **"Signal Chat"** for the messaging platform (NOT "ChronoChat")
- **Customer support email**: team@dwsc.io (consolidated — no other support emails)

## User Preferences
- Preferred communication style: Simple, everyday language
- User wants: Full blockchain implementation, not just a web portal. No piggybacking on other chains.
- Design: Premium UI with extensive visual effects ("everything should sparkle and shine")
- Mobile: Mobile-first design with self-contained carousels, accordions, dropdowns
- Branding: White-labeled, no Replit branding, dark theme only
- Stripe: FULLY CONFIGURATED - do not ask about Stripe keys, payments are ready
- App Store Target: Build for eventual React Native + Expo port - iOS App Store & Google Play as standalone ecosystem apps

## System Architecture

### UI/UX Decisions
The UI/UX adheres to a "MANDATORY PREMIUM UI PROTOCOL," emphasizing a dark theme and polished aesthetics. Key elements include:
- **Layout**: True Bento Grid (3-Column) with responsive adjustments for desktop (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`), `gap-4`, and `container mx-auto px-4 sm:px-6 lg:px-8`.
- **Glassmorphism**: All cards utilize `<GlassCard glow>` with `bg-slate-900/50` or `bg-white/5`, `backdrop-blur-xl`, `border border-white/10`, and generous padding.
- **Visual Effects**: Extensive use of `glow` props, `hover:border-cyan-500/30` transitions, `shadow-2xl` for depth, and Framer Motion for interactive elements.
- **Spacing**: Consistent padding (`pt-20 pb-12` for pages, `mb-8` for sections, `p-4` minimum for cards) to ensure visual clarity.
- **Mobile-First**: Responsive design across all breakpoints, 44px minimum touch targets, and responsive font sizes.
- **Interactive Components**: Swiper or custom carousels, Accordion component for expandable content, and collapsible drawers for mobile navigation.
- **Animations**: `motion.div` for page transitions, staggered children animations, premium badges with glow, and gradient text for headlines.
- **Color Palette**: Exclusively dark theme with `bg-slate-950`/`bg-slate-900` backgrounds, Primary Cyan, Secondary Purple, Accent Pink, `text-white` variations, and semantic colors.
- **Component Standards**: Required `GlassCard` with `glow`, `Badge`, UI library `Button`, `motion.div` wrapper, and `data-testid` on interactive elements.

### Technical Implementations
- **Blockchain Core**: BFT-PoA consensus, stake-weighted validators, PostgreSQL state, SHA-256/Merkle trees, 400ms block time, 200K+ TPS. Includes validator staking, slashing, epoch-based finality, and node sync APIs. Native asset: Signal (SIG).
- **Web Portal Frontend**: React 18, TypeScript, Vite, Wouter, TanStack Query, Tailwind CSS v4, Framer Motion.
- **Web Portal Backend**: Node.js, Express.js, TypeScript, Drizzle ORM, PostgreSQL.
- **Authentication**: Firebase Auth (multiple providers), server-side Firebase token verification, WebAuthn/Passkeys, PIN authentication.
- **Multi-PWA**: Host-based routing for ecosystem domains.
- **DeFi Features**: Testnet Faucet, AMM-style DEX/Token Swap, NFT Marketplace & Gallery, Portfolio Dashboard, Transaction History, Token Launchpad, Liquidity Pools, NFT Creator Tool, Price Charts (Recharts), Webhook/Events API, Liquid Staking (stSIG).
- **Cross-Chain Bridge**: Lock & mint mechanism for SIG ↔ wSIG across Ethereum (Sepolia), Solana (Devnet), Polygon (Amoy), Arbitrum (Sepolia), Base (Sepolia).
- **DarkWave Chronicles**: A parallel life simulation where players experience different historical eras. Real-time gameplay, authentic choices, and AI-generated personalized situations based on player history. Includes persistent NPCs and educational themes. Features a "Faith & Spiritual Life System" with a Cepher Bible, era-appropriate congregations, prayer tracking, and AI-generated worship.
- **Guardian Suite**: Includes Guardian Scanner (AI security verification for agents and URLs), Guardian Screener (DEX screener with real-time threat detection), Guardian Certification Program (blockchain security audit service), and Guardian Shield (continuous blockchain security monitoring).
- **Trust Book**: Premium ebook publishing and reading platform at `/trust-book`. Features 5-tab interface (Discover, Browse, My Library, Write, Publish). Flagship title: "Through The Veil" (107K words, 54+ chapters, 15 volumes, $4.99 with 4-chapter free preview). Category system: Fiction (12 subcategories) and Non-Fiction (13 subcategories) with filterable browsing. Personal library with reading progress tracking. AI Book Author Agent (GPT-4o powered writing assistant with persistent sessions). Author publishing portal with category/subcategory selection, 70% royalty, admin review workflow. Supports AI narration, multi-format reading (online/PDF/EPUB), blockchain-verified provenance. DB tables: `ebook_purchases`, `published_books`, `user_library`, `ai_writing_sessions`. Listed in ecosystem as App #31 at `https://trustbook.tlid.io`.
- **Launch Countdown**: Master launch roadmap at `/launch` with July 4, 2026 target date. Real-time countdown timer, 6-phase checklist (Core Infrastructure, DeFi Ecosystem, Cross-Chain Bridge, Security & Guardian, Ecosystem & Apps, Launch Preparation) with done/in-progress/pending status tracking. Featured prominently in hamburger menu and presale page countdown banner. "Independence Day for Trust" branding.
- **Ecosystem Infrastructure**: Credits System (for AI services), Owner Admin Portal, Marketing Automation, Payment Infrastructure (crowdfunding/presales), Pre-Launch Airdrop System, Signal Chat Platform (cross-app messaging), Shells Economy System (pre-launch currency), Subscription System, Early Adopter Rewards System, Backend IDE / Studio Executor.
- **Innovation Hub Features**: Guardian Security Scores, ChronoPass Identity, Experience Shards, Quest Mining System, Zealy Integration, Reality Layer Oracles, AI Verified Execution, Guardian Studio Copilot, AI Agent Marketplace, RWA Tokenization.
- **Web Presence**: Trust Layer Landing Page, Strategic Marketing Pages, Business Tenant Portals, DarkWave Academy (education and certification platform), Blockchain Domain Service (.tlid).
- **Inter-Ecosystem**: Multi-SIG Multi-Chain Wallet, Ecosystem SSO (Single Sign-On), Ecosystem Credential Sync, TrustVault Blockchain Integration API (HMAC-authenticated REST endpoints for identity, media provenance, trust engine, and Signal assets). TrustVault outbound client (`server/trustvault-client.ts`) connects to TrustVault at `https://trustvault.replit.app/api/studio` using HMAC-SHA256 auth. Book provenance auto-registered on approval. Webhook receiver at `POST /api/trustvault/webhook`.
- **Security**: Helmet.js, CORS, rate limiting, AES-256-GCM, HMAC-SHA256, parameterized SQL.
- **React Native Portability**: Guidelines for shared business logic, data fetching with TanStack Query, React hooks for state, NativeWind for styling, and separating logic from presentation.

### Ecosystem Domains & Subdomains
The ecosystem spans 30 verified applications across primary domains (`dwsc.io`, `darkwavegames.io`, `darkwavestudios.io`, `yourlegacy.io`, `tlid.io`, `trustshield.tech`, `intothevoid.app`), external ecosystem apps (e.g., `orbitstaffing.io`, `garagebot.io`, `verdara.replit.app`), and internal PWA routes (e.g., `/academy`, `/guardian-scanner`, `/signal-chat`). Verdara (App #28) is an AI-powered outdoor recreation super-app; Arbora (App #29) is a standalone arborist business management PWA running within Verdara at `/arbora/*`.

### Tokenomics
- **Native Asset**: Signal (SIG), Total Supply: 1,000,000,000 SIG.
- **Pre-launch Currency**: Shells (1 Shell = $0.001, converts to SIG).
- **In-game Currency**: Echo (1 Echo = $0.0001, not convertible; 10 Echoes = 1 Shell).
- **Allocation**: Treasury Reserve (50%), Staking Rewards (15%), Development & Team (15%), Ecosystem Growth (10%), Community Rewards (10%).
- **Referral System**: Multiplier-based Shell rewards for referrals, with automated payouts and no limits.

## External Dependencies
- **Database**: PostgreSQL
- **Authentication**: Firebase Auth
- **Payments**: Stripe, Coinbase Commerce
- **Hub API**: https://orbitstaffing.io
- **AI**: OpenAI GPT-4o
- **Social**: Twitter/X, Discord, Telegram, Facebook automation

## Embeddable Ecosystem Widget

The ecosystem includes a self-contained embeddable widget that any app (internal or partner) can add with a single script tag. It renders a floating button that opens a panel showing all 30 ecosystem apps, live presale stats, and the user's SIG balance and subscription status when authenticated via SSO.

### Embed Code (for any web app, React, or plain HTML)
```html
<script src="https://dwsc.io/api/ecosystem/widget.js"></script>
```

### Custom API Base (for dev/staging)
```html
<script src="https://dwsc.io/api/ecosystem/widget.js" data-api="https://your-app-url.replit.app"></script>
```

### Widget Data API (for React Native / Expo / backend agents)
```
GET https://dwsc.io/api/ecosystem/widget-data
Authorization: Bearer <sso_token>  (optional, for personalized data)
```
Returns: `{ apps, presale, user, subscription, presaleBalance }`

### Key Files
- **Widget script**: `client/public/ecosystem-widget.js`
- **API endpoints**: `server/routes.ts` (search for "EMBEDDABLE ECOSYSTEM WIDGET")
- **Full integration handoff**: `VERDARA_RETURN_HANDOFF.md`

## Shared Components System

A cross-app shared UI system that lets any ecosystem app load standardized DarkWave components (footer, announcement bar, trust badge) with a single script tag. Components are rendered server-side and auto-placed into the page.

### Embed Code (one line for any app)
```html
<script src="https://dwsc.io/api/ecosystem/shared/loader.js"
  data-components="footer,announcement-bar,trust-badge"
  data-theme="dark">
</script>
```

### Configuration
- `data-components` — Comma-separated list: `footer`, `announcement-bar`, `trust-badge`, or `all`
- `data-theme` — `dark` or `light`
- `data-api` — Custom API base for dev/staging (defaults to `https://dwsc.io`)

### Auto-Placement
- `announcement-bar` — top of `<body>`
- `footer` — bottom of `<body>`
- `trust-badge` — fixed bottom-right corner

### Manual Placement
Place an empty div with the component's ID to control where it renders:
```html
<div id="dw-shared-footer"></div>
```

### Direct Render URLs (fetch raw HTML)
```
GET https://dwsc.io/api/ecosystem/shared/render/footer?theme=dark
GET https://dwsc.io/api/ecosystem/shared/render/announcement-bar?theme=dark
GET https://dwsc.io/api/ecosystem/shared/render/trust-badge?theme=dark
```

### Bundle Endpoint (multiple components as JSON)
```
GET https://dwsc.io/api/ecosystem/shared/bundle?components=footer,trust-badge&theme=dark
```
Returns: `{ components: { footer: "<html>...", "trust-badge": "<html>..." }, theme, version }`

### Key Files
- **Loader script**: `client/public/ecosystem-shared-loader.js`
- **Component renderers & API**: `server/routes.ts` (search for "SHARED COMPONENTS SYSTEM")
- **Available components**: `footer`, `announcement-bar`, `trust-badge`