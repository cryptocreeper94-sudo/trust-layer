# New PWA Catalog Entries for DarkWave Trust Layer

These two PWAs are already included in the total line count of the dwsc.io codebase. They are being separated out as standalone installable apps within the ecosystem. No additional lines of code need to be counted — they are part of the existing build.

---

## 1. Guardian Screener

**App Name:** Guardian Screener
**Route:** /guardian-shield
**Domain Target:** guardianscreener.io (future)
**Status:** Under Development — Launching at TGE
**Category:** DeFi / Trading Tools
**PWA:** Yes — Installable with dedicated manifest, service worker, and home screen icon

### Marketing Description

Guardian Screener is DarkWave's high-powered DEX screener built for traders who refuse to fly blind. Powered by AI-driven threat detection and predictive market intelligence, Guardian Screener monitors decentralized exchanges in real time — surfacing opportunities, flagging risks, and giving you the edge before everyone else sees it.

This isn't just another chart tool. Guardian Screener combines smart pattern detection with continuous 24/7 security monitoring to help you separate signal from noise across every major chain. Whether you're sniping new launches, tracking whale movements, or scanning for rug pull red flags, Guardian Screener has your back.

**Key Features:**
- AI-powered smart pattern detection across all major DEXs
- Predictive analytics and market intelligence engine
- Real-time 24/7 security monitoring and threat alerts
- Multi-chain coverage (Solana, Ethereum, Base, BSC, Arbitrum, Polygon, DarkWave)
- Rug pull and honeypot risk detection
- Whale concentration and bot activity tracking
- Liquidity lock verification
- Installable as a standalone app on iOS and Android

### Tech Stack
- React 18, TypeScript, Vite
- Framer Motion animations
- Tailwind CSS v4 (dark theme)
- PWA with Web App Manifest + Service Worker
- Glassmorphism UI with glow effects
- Mobile-first responsive design

### Image Direction for Catalog
Generate a dark, premium fintech-style image showing a futuristic trading dashboard with candlestick charts, radar scanning lines sweeping across the screen, and a glowing shield icon in the center. Color palette: deep navy/slate background with cyan, purple, and pink gradient accents. The mood should feel like a high-tech command center for crypto traders — sleek, powerful, and dangerous in a good way. Include subtle particle effects or data streams flowing across the composition. Aspect ratio: 16:9 for catalog card.

---

## 2. Guardian Agent Scanner

**App Name:** Guardian Agent Scanner
**Route:** /guardian-scanner
**Domain Target:** Part of dwsc.io ecosystem
**Status:** Live
**Category:** AI / Security / Intelligence
**PWA:** Yes — Installable with dedicated manifest, service worker, splash screen, and home screen icon

### Marketing Description

Guardian Agent Scanner is the Trust Layer's AI-powered scanning and analysis engine — purpose-built to evaluate, verify, and score autonomous AI agents operating across blockchain networks. In a world where AI agents are making trades, managing wallets, and executing smart contracts on behalf of users, knowing which agents you can trust isn't optional — it's survival.

Guardian Agent Scanner runs deep analysis on AI agents across 13+ blockchains, producing comprehensive safety scores, behavioral pattern analysis, and risk assessments. Every agent gets a Guardian Score based on security posture, transparency, reliability, and compliance. Think of it as a credit score for AI — except the stakes are your crypto.

The scanner features real-time WebSocket updates, multi-chain token monitoring, contract address lookup, AI confidence scoring powered by machine learning prediction models, and a full quick-trade panel for acting on insights instantly. It's not just information — it's actionable intelligence.

**Key Features:**
- AI agent verification and certification scoring across 13+ chains
- Guardian Score safety ratings (security, transparency, reliability, compliance)
- Real-time WebSocket live data feeds
- Multi-chain support: Solana, Ethereum, Base, BSC, Arbitrum, Polygon, DarkWave
- Contract address lookup and deep analysis
- ML-powered prediction engine with directional confidence scores
- Honeypot, mint authority, freeze authority, and liquidity lock detection
- Whale concentration and bot activity analysis
- Quick-trade panel for instant action on insights
- Category filtering: Meme, DeFi, Blue Chip, Gaming, AI, NFT, Stable, RWA
- Sortable by trending, volume, gainers, losers, newest, Guardian Score, AI confidence, transactions, liquidity, market cap
- Time-based filtering: 5M, 1H, 6H, 24H
- Installable as a standalone app on iOS and Android with custom splash screen

### Tech Stack
- React 18, TypeScript, Vite
- Framer Motion animations with splash screen
- Tailwind CSS v4 (dark theme)
- WebSocket real-time data (custom Guardian WS hook)
- TanStack Query for data fetching
- PWA with Web App Manifest + Service Worker
- Glassmorphism UI with glow effects and gradient badges
- Mobile-first responsive design with chain selector dropdowns
- ML prediction integration (Pulse AI engine)

### Image Direction for Catalog
Generate a dark, futuristic AI security interface showing a holographic scanner analyzing a glowing AI agent icon (a stylized robot or neural network brain). The scanner should have circular scanning rings or radar-style sweep lines around the agent. Display floating data panels showing safety scores, risk levels, and chain logos. Color palette: deep slate/navy background with bright cyan as the primary accent, purple secondary, and subtle green for "safe" indicators. The mood should feel like a high-security verification terminal — authoritative, intelligent, and trustworthy. Include subtle matrix-style data streams or blockchain node connections in the background. Aspect ratio: 16:9 for catalog card.

---

## Notes for the Architect Agent
- Both PWAs are already built and included in the dwsc.io codebase total line count. Do NOT add additional lines to the count — these are being cataloged as separate installable apps within the existing ecosystem.
- Guardian Screener is currently a "Coming Soon" landing page that will be built out at TGE. The PWA shell is complete and installable.
- Guardian Agent Scanner is fully functional and live with real-time data, WebSocket feeds, and ML predictions.
- Both use the same dark theme, glassmorphism design system, and Framer Motion animation patterns as all other DarkWave PWAs.
