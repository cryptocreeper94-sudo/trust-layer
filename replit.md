# DarkWave Smart Chain - Replit Agent Guide

## Overview
DarkWave Smart Chain (DSC) is a high-performance Layer 1 Proof-of-Authority (PoA) blockchain ecosystem by DarkWave Studios. It features the DarkWave Portal, a comprehensive React web application serving as an ecosystem interface, block explorer, and developer hub. The project also includes "DarkWave Chronicles," a fantasy-themed game focused on a living political simulation and community-driven content. The primary goal is to deliver a fast, feature-rich blockchain with a premium user experience and innovative gaming across four key domains: dwsc.io, darkwavegames.io, darkwavestudios.io, and yourlegacy.io.

## User Preferences
- Preferred communication style: Simple, everyday language
- User wants: Full blockchain implementation, not just a web portal. No piggybacking on other chains.
- Design: Premium UI with extensive visual effects ("everything should sparkle and shine")
- Mobile: Mobile-first design with self-contained carousels, accordions, dropdowns
- Branding: White-labeled, no Replit branding, dark theme only
- Stripe: FULLY CONFIGURATED - do not ask about Stripe keys, payments are ready

## System Architecture

### UI/UX Decisions - MANDATORY PREMIUM UI PROTOCOL
**CRITICAL: Every new page MUST be built with the Ultra-Premium Bento Grid LED Protocol by default. This is the baseline design standard, not an enhancement.**

Every page requires:
1. **Floating Ambient Orbs**: Absolute-positioned, blurred gradient circles (`bg-cyan-500/10 rounded-full blur-3xl animate-pulse`)
2. **Glassmorphism**: Use `GlassCard` component or `bg-[rgba(12,18,36,0.65)] backdrop-blur-2xl border-white/[0.08]`
3. **Holographic Glow**: `shadow-[0_0_40px_rgba(0,255,255,0.15)]` on cards, gradient border glows
4. **Framer Motion**: Entry animations, hover states, transitions on all interactive elements
5. **Gradient Headlines**: `bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent`
6. **Bento Grid Layouts**: Multi-column responsive grids with varied card sizes
7. **Premium Badges**: Gradient backgrounds with border glows, uppercase tracking
8. **Mobile-First**: Touch targets ≥48px, horizontal carousels, accordions, optimized for 375px viewport
9. **Color Palette**: Cyan/Purple/Pink accents; `slate-950`, `slate-900`, `slate-800` backgrounds; white/gray text
10. **Import `GlassCard`**: From `@/components/glass-card` - use with `glow` prop enabled

### Technical Implementations
- **Blockchain**: BFT-PoA consensus with stake-weighted validator selection, PostgreSQL state storage, SHA-256/Merkle trees/HMAC-SHA256, 400ms block time, 200K+ TPS. Features validator staking, slashing, epoch-based finality, and node sync APIs. Native token DWC (100M supply, 18 decimals, no burn).
- **Web Portal (Frontend)**: React 18, TypeScript, Vite, Wouter, TanStack Query, Tailwind CSS v4, Framer Motion.
- **Web Portal (Backend)**: Node.js, Express.js, TypeScript, Drizzle ORM, PostgreSQL.
- **Authentication**: Firebase Auth (multiple providers), server-side Firebase token verification, WebAuthn/Passkeys, PIN authentication.
- **Multi-PWA**: Host-based routing for ecosystem domains.
- **DeFi Features**: Testnet Faucet, AMM-style DEX/Token Swap, NFT Marketplace & Gallery, Portfolio Dashboard, Transaction History, Token Launchpad, Liquidity Pools, NFT Creator Tool, Price Charts (Recharts), Webhook/Events API, Liquid Staking (stDWC).
- **Cross-Chain Bridge**: Lock & mint (DWC ↔ wDWC) for Ethereum Sepolia and Solana Devnet.
- **DarkWave Chronicles**: A social experiment and parallel life simulation focusing on self-discovery across eras, with a persistent world and emotion-driven AI. It is narrative-driven and not a traditional RPG.
- **Credits System**: Manages costs for AI chat, scenario generation, voice cloning, and personality summaries.
- **Voice Cloning Technology**: Integrates Web Audio API and external APIs.
- **Owner Admin Portal**: Secure portal (`/owner-admin`) with `OWNER_SECRET` authentication, rate limiting, and lockout.
- **Marketing Automation System**: Proprietary auto-deployment system for social media (Twitter/X, Facebook, Discord, Telegram).
- **Payment Infrastructure**: Handles crowdfund donations and token presales with Stripe integration.
- **Pre-Launch Airdrop System**: Manages affiliate commissions for pre-launch, distributed as DWC tokens, using a dual-ledger design.
- **ChronoChat Platform**: Standalone community platform at chronochat.io with real-time WebSocket messaging, community features, and bot framework.
- **Shells Economy System**: Pre-launch virtual currency, convertible to DWC, earned through engagement, purchased via Stripe, and used for tipping/premium features. Features atomic transaction handling.
- **Subscription System**: Unified subscription management synced with the main Pulse app, with tiers, free trials, and cross-app entitlement checking.
- **Guardian Certification Program**: In-house blockchain security audit service with tiered offerings and a public registry.
- **Guardian Shield**: Continuous blockchain security monitoring service with tiers, 24/7 smart contract monitoring, threat detection, multi-chain coverage, and instant alerts.
- **Security Infrastructure**: Helmet.js security headers, CORS with strict origin allowlist, rate limiting, AES-256-GCM encryption, HMAC-SHA256 signatures, and parameterized SQL via Drizzle ORM.
- **Early Adopter Rewards System**: Tracks signup positions and tiered crowdfund bonuses for DWC airdrops. API: `/api/user/early-adopter-stats` (authenticated), `/api/early-adopter/counters` (public). Rewards page at `/rewards`.
- **Backend IDE / Studio Executor**: Docker container orchestration for code execution (`server/studio-executor.ts`), designed for self-hosted deployment (not runnable on Replit). Requires JWT auth, sandboxing, network policies, and resource enforcement.
- **Innovation Hub Features**:
    - **Guardian Security Scores**: Real-time project security ratings with 7 components and insurance eligibility tracking.
    - **ChronoPass Identity**: Unified cross-app identity with a reputation system and Passkey/WebAuthn support.
    - **Experience Shards**: Dedicated execution lanes for different use cases (gaming, defi, nft, social, ai, custom) with performance SLAs.
    - **Quest Mining System**: Verifiable contribution rewards with daily/weekly/seasonal/achievement quests.
    - **Reality Layer Oracles**: On-chain notarization for game outcomes and real-world events with multi-chain verification.
    - **AI Verified Execution**: Cryptographic proofs for AI decisions from registered models.
    - **Guardian Studio Copilot**: AI-powered smart contract generator with automatic security audits.
    - **AI Agent Marketplace**: Autonomous AI agent deployment platform with revenue sharing for creators.
    - **RWA Tokenization**: Real-world asset tokenization platform for institutional investment with Guardian-verified assets and fractional ownership.
- **Strategic Marketing Pages**: Competitive Analysis (`/token-compare`), Investor Pitch (`/investor-pitch`), Innovation Hub (`/innovation`) dashboard.
- **Games Arcade**: Full arcade with classic games (Tetris, Pacman, Snake, Solitaire, Spades, Minesweeper, Galaga, Coinflip, Crash, Slots, Lottery, Predictions) with leaderboards and Shells economy integration.

## External Dependencies
- **Database**: PostgreSQL
- **Authentication**: Firebase Auth
- **Payments**: Stripe, Coinbase Commerce
- **Hub API**: https://orbitstaffing.io
- **AI**: OpenAI GPT-4o (via Replit AI Integrations)
- **Social**: Twitter/X, Discord, Telegram, Facebook automation