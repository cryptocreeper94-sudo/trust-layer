# DarkWave Ecosystem - Complete PWA Catalog
**Last Updated: February 14, 2026**
**Total Codebase: 228,045 lines | 290 database tables | 743 API endpoints**
**Base Domain: dwsc.io**

---

## 1. Trust Layer (Main Platform)
- **URL:** `dwsc.io/`
- **PWA ID:** `/trust-layer-dwsc`
- **Manifest:** `manifest-dwsc.webmanifest`
- **Icon:** `/icons/trustlayer-512.png`
- **Theme Color:** #00ffff (Cyan)
- **Categories:** Finance, Productivity, Utilities
- **Description:** The Coordinated Trust Layer for verified identity, accountability, and transparent audit trails. DeFi, staking, NFTs, and developer tools.
- **Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Wouter, TanStack Query, Express.js, Drizzle ORM, PostgreSQL
- **Lines of Code:** ~7,617 (frontend DeFi pages) + ~22,000 (server routes) + shared infrastructure
- **Key Features:**
  - BFT-PoA blockchain (400ms blocks, 200K+ TPS)
  - Multi-chain wallet (Ethereum, Solana, Polygon, Arbitrum, Base)
  - Cross-chain bridge (lock & mint SIG/wSIG)
  - DEX / Token Swap (AMM-style)
  - NFT Marketplace, Gallery, Creator Tool
  - Staking & Liquid Staking (stSIG)
  - Token Launchpad
  - Testnet Faucet
  - Block Explorer
  - SIG Presale with Stripe integration
  - Portfolio Dashboard
  - Firebase Auth + WebAuthn/Passkeys

---

## 2. Guardian Scanner
- **URL:** `dwsc.io/guardian-scanner`
- **PWA ID:** `/guardian-scanner`
- **Manifest:** `manifest-guardian.webmanifest`
- **Icon:** `/icons/guardian-scanner-icon-512.png`
- **Splash:** `/icons/guardian-scanner-splash.png`
- **Theme Color:** #06b6d4 (Cyan)
- **Categories:** Finance, Utilities, Security
- **Description:** AI-powered token analysis scanner with Pulse predictive scoring. Real-time safety checks, multi-chain monitoring, and Strike Agent recommendations.
- **Tech Stack:** React 18, TypeScript, Framer Motion, DexScreener API (live data), WebSocket real-time updates, Pulse Safety Engine
- **Lines of Code:** ~4,403
- **Key Features:**
  - Live DexScreener data (trending, gainers, new tokens)
  - Multi-chain support (Solana, Ethereum, BSC, Base, Arbitrum, Polygon)
  - Pulse Safety Engine (honeypot detection, whale concentration, liquidity lock analysis)
  - ML prediction signals (bullish/bearish/neutral)
  - Token detail pages with real contract data
  - Mobile-first with tap-to-detail navigation
  - PWA install prompt with iOS fallback

---

## 3. Signal Chat
- **URL:** `dwsc.io/signal-chat`
- **PWA ID:** `/signal-chat`
- **Manifest:** `manifest-signal-chat.webmanifest`
- **Icon:** `/icons/signal-chat-icon-512.png`
- **Splash:** `/icons/signal-chat-splash.png`
- **Theme Color:** #8b5cf6 (Purple)
- **Categories:** Social, Communication, Lifestyle
- **Description:** Secure community messaging for the DarkWave ecosystem. Real-time chat channels, cross-app communication, and Trust Layer verified identities.
- **Tech Stack:** React 18, TypeScript, Framer Motion, WebSocket (real-time), bcryptjs (auth), JWT HS256
- **Lines of Code:** ~862
- **Key Features:**
  - Real-time WebSocket messaging
  - Multiple chat channels
  - User registration & login (bcryptjs 12 rounds, JWT)
  - Online user presence indicators
  - Trust Layer ID integration
  - Cross-app SSO capability
  - PWA install prompt

---

## 4. DarkWave Chronicles
- **URL:** `dwsc.io/chronicles`
- **PWA ID:** `/chronicles`
- **Manifest:** `manifest-chrono.webmanifest`
- **Icon:** `/icons/chronicles-icon-512.png`
- **Theme Color:** #a855f7 (Purple)
- **Categories:** Games, Entertainment, Lifestyle
- **Description:** Not a game. A life. Live your legacy across 70+ historical eras in the ChronoVerse. Parallel life simulation with real-time world.
- **Tech Stack:** React 18, TypeScript, Framer Motion, OpenAI GPT-4o (AI scenarios), WebSocket, PostgreSQL (persistent world state)
- **Lines of Code:** ~16,003
- **Key Features:**
  - Parallel life simulation (NOT an RPG)
  - 3 playable eras: Modern, Medieval, Wild West
  - 15 factions, 75 hand-crafted situations, 9 NPCs
  - Real-time world (1 hour = 1 real hour, timezone-synced)
  - NPC persistent relationships (-20 to +20 scores)
  - AI-generated infinite daily situations after crafted content
  - Estate building & interior decoration per era
  - City zones with explorable locations
  - Voice cloning system
  - Echoes currency (in-game, non-convertible)
  - Educational themes woven into gameplay

---

## 5. TrustShield
- **URL:** `trustshield.tech/` (also `dwsc.io/guardian-ai`)
- **PWA ID:** `/trustshield`
- **Manifest:** `manifest-trustshield.webmanifest`
- **Icon:** `/icons/trustshield-512.png`
- **Theme Color:** #06b6d4 (Cyan)
- **Categories:** Security, Business, Utilities, Finance
- **Description:** The world's first AI agent certification system. Verify, certify, and protect autonomous AI agents across Security, Transparency, Reliability, and Compliance.
- **Tech Stack:** React 18, TypeScript, Framer Motion, Tailwind CSS
- **Lines of Code:** ~3,049
- **Key Features:**
  - AI Agent certification (Security, Transparency, Reliability, Compliance)
  - Guardian Certification Program (Assurance Lite, Guardian Premier)
  - 5-phase audit process
  - Public registry at /guardian-ai-registry
  - Continuous blockchain security monitoring
  - Tiered offering system

---

## 6. ChronoChat
- **URL:** `dwsc.io/community` (also via chronochat.io domain)
- **PWA ID:** `/community-chronochat`
- **Manifest:** `manifest-chronochat.webmanifest`
- **Icon:** `/icons/chronochat-icon-512.png`
- **Theme Color:** #06b6d4 (Cyan)
- **Categories:** Social, Communication, Lifestyle
- **Description:** Connect across timelines. Chat beyond eras. The community hub for DarkWave ecosystem.
- **Tech Stack:** React 18, TypeScript, Framer Motion
- **Lines of Code:** ~166
- **Key Features:**
  - Community hub for ecosystem
  - Cross-era chat concept (ties into Chronicles)
  - Community channels and messaging

---

## 7. DarkWave Games
- **URL:** `darkwavegames.io/` (also `dwsc.io/arcade`)
- **PWA ID:** `/darkwave-games`
- **Manifest:** `manifest-games.webmanifest`
- **Icon:** `/icons/games-icon-unique-512.png`
- **Theme Color:** #ec4899 (Pink)
- **Categories:** Games, Entertainment, Casino
- **Description:** Premium arcade games, provably fair sweepstakes, and classic card games. Play for fun or play to win!
- **Tech Stack:** React 18, TypeScript, Framer Motion, Canvas API, Stripe (coin purchases)
- **Lines of Code:** ~5,276
- **Key Features:**
  - Orbit Crash (multiplier game)
  - Dragon's Fortune Slots
  - Arcade game collection
  - Coin Store (Gold Coins & Sweeps Coins via Stripe)
  - Provably fair system
  - Sweepstakes rules & compliance
  - Game developer portal

---

## 8. DarkWave Studio (IDE)
- **URL:** `darkwavestudios.io/` (also `dwsc.io/studio`)
- **PWA ID:** `/darkwave-studio`
- **Manifest:** `manifest-studios.webmanifest`
- **Icon:** `/icons/studios-icon-512.png`
- **Theme Color:** #06b6d4 (Cyan)
- **Categories:** Business, Productivity
- **Description:** The integrated development environment for building on DarkWave Smart Chain.
- **Tech Stack:** React 18, TypeScript, Framer Motion, Monaco Editor, Docker (sandboxed execution), JWT auth
- **Lines of Code:** ~7,006
- **Key Features:**
  - Browser-based IDE
  - Smart contract development
  - Docker container orchestration for code execution
  - JWT-authenticated sessions
  - Resource enforcement & sandboxing
  - Studio documentation
  - Project management
  - Developer portal

---

## 9. Through The Veil
- **URL:** `dwsc.io/veil`
- **PWA ID:** `/veil`
- **Manifest:** `manifest-veil.webmanifest`
- **Icon:** `/icons/veil-512x512.png`
- **Theme Color:** #a855f7 (Purple)
- **Categories:** Books, Education, News
- **Description:** A Journey Through Hidden History, Suppressed Truth, and Spiritual Warfare. By Jason Andrews.
- **Tech Stack:** React 18, TypeScript, Framer Motion
- **Lines of Code:** ~1,860
- **Key Features:**
  - Online book reader
  - Volume 2 print edition
  - Chapter navigation
  - Premium reading experience

---

## 10. Trust Layer (Generic/Fallback)
- **URL:** `tlid.io/` (fallback manifest)
- **PWA ID:** `/trust-layer`
- **Manifest:** `manifest.webmanifest`
- **Icon:** `/icons/trustlayer-512.png`
- **Theme Color:** #00ffff (Cyan)
- **Categories:** Finance, Business, Utilities, Security
- **Description:** The Coordinated Trust Layer for verified identity, accountability, and transparent audit trails. Powered by DarkWave Smart Chain.
- **Notes:** Generic fallback manifest for non-domain-specific access. Same platform as #1 but used when accessed via tlid.io or other domains.

---

## Domain Mapping
| Domain | PWA Served |
|---|---|
| dwsc.io | Trust Layer (#1) |
| dwsc.io/guardian-scanner | Guardian Scanner (#2) |
| dwsc.io/signal-chat | Signal Chat (#3) |
| dwsc.io/chronicles | DarkWave Chronicles (#4) |
| trustshield.tech | TrustShield (#5) |
| chronochat.io | ChronoChat (#6) |
| darkwavegames.io | DarkWave Games (#7) |
| darkwavestudios.io | DarkWave Studio (#8) |
| dwsc.io/veil | Through The Veil (#9) |
| tlid.io | Trust Layer (#10) |
| yourlegacy.io | DarkWave Chronicles (#4) |

## Shared Infrastructure
- **Native Token:** Signal (SIG) - Trust Network Access Token
- **Pre-launch Currency:** Shells (1 Shell = $0.001)
- **In-game Currency:** Echoes (Chronicles only, non-convertible)
- **Authentication:** Firebase Auth (multi-provider) + WebAuthn/Passkeys
- **Payments:** Stripe (fully configured) + Coinbase Commerce
- **AI:** OpenAI GPT-4o
- **Database:** PostgreSQL (290 tables)
- **API Endpoints:** 743 total
- **Security:** Helmet.js, CORS, rate limiting, AES-256-GCM, HMAC-SHA256
