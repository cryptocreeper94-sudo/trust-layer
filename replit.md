# DarkWave Smart Chain - Replit Agent Guide

## Overview

DarkWave Smart Chain (DSC) is a blockchain ecosystem by DarkWave Studios, aiming to surpass Solana and Ethereum in speed, stability, and features. It comprises a Layer 1 Proof-of-Authority blockchain and the DarkWave Portal, a React web application for ecosystem interface, block explorer, and developer hub. The project also includes "DarkWave Chronicles," a fantasy-themed game with a living political simulation and community-driven creation. The ecosystem is structured across four domains: dwsc.io (main blockchain portal), darkwavegames.io (gaming), darkwavestudios.io (parent company site), and yourlegacy.io (Chronicles standalone).

## User Preferences

- Preferred communication style: Simple, everyday language
- User wants: Full blockchain implementation, not just a web portal. No piggybacking on other chains.
- Design: Premium UI with extensive visual effects ("everything should sparkle and shine")
- Mobile: Mobile-first design with self-contained carousels, accordions, dropdowns
- Branding: White-labeled, no Replit branding, dark theme only

## System Architecture

### UI/UX Decisions
- **Design Protocol**: Mandatory for all new pages. Includes asset selection (photorealistic images from `attached_assets/generated_images/` for every card/tile/panel), bento grid layouts with varied card sizes, mobile-first responsive breakpoints, and hero sections with photorealistic backgrounds.
- **Interactive Elements**: Hover effects (scale, glow, 3D transforms), Framer Motion entrance animations, info tooltips, and description modals.
- **Visual Effects**: Glassmorphism (backdrop-blur, semi-transparent backgrounds), holographic borders with glow effects, gradient overlays on images for text readability, and shimmer effects on premium/CTA elements.
- **Mobile Requirements**: Touch targets ≥48px, self-contained horizontal carousels, accordions for dense content, and testing at 375px viewport width.
- **Component Standards**: `data-testid` on all interactive elements, consistent spacing, and typography scale.
- **Color Palette**: Primary Cyan, Purple, Pink; gradients `from-cyan-500 via-purple-500 to-pink-500`; dark gray/black backgrounds; white/gray text.

### Technical Implementations
- **Blockchain**: Proof-of-Authority (PoA) with Founders Validator, PostgreSQL for storage, SHA-256/Merkle trees/HMAC-SHA256 cryptography, 400ms block time, 200K+ TPS. Native token DWC (100M supply, 18 decimals, no burn).
- **Web Portal**:
    - **Frontend**: React 18, TypeScript, Vite, Wouter, TanStack Query, Tailwind CSS v4, Framer Motion.
    - **Backend**: Node.js, Express.js, TypeScript, Drizzle ORM, PostgreSQL.
    - **Authentication**: Replit Auth (OAuth 2.0), WebAuthn/Passkeys.
    - **Payments**: Stripe, Coinbase Commerce.
    - **Multi-PWA**: Host-based routing for `dwsc.io`, `darkwavegames.io`, `darkwavestudios.io`, and `yourlegacy.io`.
- **DarkWave Studio (IDE)**: Monaco editor, file tree, multi-file tabs, Git integration, simulated terminal, deployment UI, package manager, environment variables, project templates, search/replace, keyboard shortcuts, real-time collaboration, Live Preview, Database Explorer, CI/CD, AI Assistant.
- **DeFi Features**: Testnet Faucet, DEX/Token Swap (AMM-style), NFT Marketplace, Portfolio Dashboard, Transaction History, Token Launchpad, Liquidity Pools, NFT Gallery, NFT Creator Tool, Price Charts (Recharts), Webhook/Events API, Liquid Staking (stDWC).
- **Cross-Chain Bridge**: Lock & mint (DWC ↔ wDWC) for Ethereum Sepolia & Solana Devnet. Includes wDWC ERC-20 contract and Solana bridge program.
- **Contract Architecture**: UUPS Proxy for Ethereum (wDWC.sol), BPF Loader for Solana (wdwc-bridge). Governance via DSC Improvement Proposal (DSCIP) with Testnet, Canary, Mainnet stages.
- **DarkWave Chronicles (Flagship Product)**:
    - **Core Concept**: Real-time, persistent life simulator where the player is their actual self in a fantasy world (ChronoVerse).
    - **Era System**: Choose starting era, natural progression, time travel events.
    - **Community-Driven Development**: User-submitted ideas, creator ownership of in-game properties.
    - **Storefront Sponsorship**: Real businesses sponsor in-game locations, with revenue from licensing fees, click royalties, and conversion bonuses.
    - **AI Engine (Planned)**: 3-tier stack (Deterministic Planners, LLM Microservices, Offline LLM Batches), 5-Axis Emotion System, Belief System Layer.

## External Dependencies

- **Database**: PostgreSQL (via DATABASE_URL)
- **Authentication**: Replit Auth, WebAuthn
- **Payments**: Stripe, Coinbase Commerce
- **Hub API**: https://orbitstaffing.io (HMAC-SHA256 authenticated)
- **AI**: OpenAI (for TTS and AI code assistant)

## Chronicles Development Roadmap

### Phase 0 (Q1-Q2 2025) - Foundation
- Website & branding launch ✓
- Crowdfunding infrastructure ✓
- Discord setup & community launch
- Telegram re-engagement & DarkWave Pulse mini-app
- Social media presence (Twitter/X)
- Core database schema design
- Basic AI agent framework
- Single-era sandbox (Medieval)

### Phase 1 (Q3-Q4 2025) - Economy & Property
- Property registry (blockchain-backed)
- Storefront sponsorship system design
- Business partner portal
- Location-based pricing engine
- Traffic analytics & conversion tracking
- Creator licensing & royalty system

### Phase 2 (Q1-Q2 2026) - Multi-Era Launch
- 10 historical eras live
- Storefront marketplace launch
- Era-specific sponsor integration
- Cross-era quest framework
- Public alpha release
- Mobile app (Android/iOS)

### Phase 3 (Q3-Q4 2026) - Full ChronoVerse
- Full 70+ era deployment
- City district auctions (premium locations)
- Advanced sponsor analytics dashboard
- Community content creation tools
- Public beta release
- DWC mainnet integration

## Marketing & Community Strategy

- **Discord**: Server with channels for announcements, dev updates, community chat, creator collaboration
- **Telegram**: Re-engage existing community, deploy DarkWave Pulse mini-app for ecosystem updates
- **Twitter/X**: Regular development updates, teasers, community engagement
- **Business Outreach**: Partner pre-registration, storefront sponsorship marketing to brands