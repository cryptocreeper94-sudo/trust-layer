# DarkWave Smart Chain - Replit Agent Guide

## Overview
DarkWave Smart Chain (DSC) is a high-performance Layer 1 Proof-of-Authority (PoA) blockchain ecosystem by DarkWave Studios. It features the DarkWave Portal, a comprehensive React web application serving as an ecosystem interface, block explorer, and developer hub. The project also includes "DarkWave Chronicles," a fantasy-themed game focused on a living political simulation and community-driven content. The ecosystem operates across four key domains: dwsc.io, darkwavegames.io, darkwavestudios.io, and yourlegacy.io. The primary goal is to deliver a fast, feature-rich blockchain with a premium user experience and innovative gaming.

## User Preferences
- Preferred communication style: Simple, everyday language
- User wants: Full blockchain implementation, not just a web portal. No piggybacking on other chains.
- Design: Premium UI with extensive visual effects ("everything should sparkle and shine")
- Mobile: Mobile-first design with self-contained carousels, accordions, dropdowns
- Branding: White-labeled, no Replit branding, dark theme only
- Stripe: FULLY CONFIGURATED - do not ask about Stripe keys, payments are ready

## System Architecture

### UI/UX Decisions
The design adheres to a "Premium UI Protocol" emphasizing:
- **Visuals**: Glassmorphism, holographic borders with glow, gradient overlays, floating ambient glow orbs.
- **Interactivity**: Framer Motion for animations (entrance, staggered delays, scale on hover, icon animations).
- **Layout**: Bento grids, full-width hero sections with photorealistic backgrounds, diverse card styles.
- **Mobile-First**: Touch targets ≥48px, horizontal carousels, accordions, optimized for 375px viewport.
- **Typography & Branding**: Gradient text for headlines, premium badges, uppercase tracking.
- **Color Palette**: Cyan, Purple, Pink accents; `slate-950`, `slate-900`, `slate-800` backgrounds; white/gray text.

### Technical Implementations
- **Blockchain**: BFT-PoA (Byzantine Fault Tolerant Proof-of-Authority) consensus with stake-weighted validator selection, 2/3+ quorum for block finality, PostgreSQL state storage, SHA-256/Merkle trees/HMAC-SHA256, 400ms block time, 200K+ TPS. Features validator staking (1000 DWC minimum), slashing for misbehavior (5% stake penalty), epoch-based finality, Nakamoto coefficient tracking, and node sync APIs. Native token DWC (100M supply, 18 decimals, no burn). Revenue from protocol fees. APIs: `/api/consensus`, `/api/validators/register`, `/api/sync/state`.
- **Web Portal (Frontend)**: React 18, TypeScript, Vite, Wouter, TanStack Query, Tailwind CSS v4, Framer Motion.
- **Web Portal (Backend)**: Node.js, Express.js, TypeScript, Drizzle ORM, PostgreSQL.
- **Authentication**: Firebase Auth (email/password, Google, GitHub, Apple, email+PIN). Server-side Firebase token verification using Firebase Admin SDK with revocation checking. WebAuthn/Passkeys available. PIN authentication (4-6 digits) for returning users, stored as SHA256 hash with user ID salt, uses timing-safe comparison.
- **Multi-PWA**: Host-based routing for ecosystem domains.
- **DeFi Features**: Testnet Faucet, AMM-style DEX/Token Swap, NFT Marketplace & Gallery, Portfolio Dashboard, Transaction History, Token Launchpad, Liquidity Pools, NFT Creator Tool, Price Charts (Recharts), Webhook/Events API, Liquid Staking (stDWC).
- **Cross-Chain Bridge**: Lock & mint (DWC ↔ wDWC) for Ethereum Sepolia and Solana Devnet (UUPS Proxy for ETH, BPF Loader for SOL).
- **DarkWave Chronicles (Parallel Life Experience)**: A social experiment and parallel life simulation focusing on self-discovery across eras. Features a persistent world, belief system integration, and emotion-driven AI (5-Axis Emotion System). Avoids traditional RPG elements.
- **Credits System**: Manages costs for AI chat, scenario generation, voice cloning, and personality summaries.
- **Voice Cloning Technology**: Integrates Web Audio API for recording and external APIs for synthesis.
- **Owner Admin Portal**: Secure portal (`/owner-admin`) with `OWNER_SECRET` authentication, rate limiting, and lockout.
- **Marketing Automation System**: Proprietary auto-deployment system for social media (Twitter/X, Facebook, Discord, Telegram).
- **Payment Infrastructure**: Handles crowdfund donations and token presales with Stripe integration.
- **Pre-Launch Airdrop System**: Manages affiliate commissions for pre-launch, distributed as DWC tokens, using a dual-ledger design.
- **ChronoChat Platform (Community Hub)**: Standalone community platform at chronochat.io. Features community creation, channels, real-time WebSocket messaging, reactions, replies, file uploads, member management, and bot framework.
- **Shells Economy System**: Pre-launch virtual currency for the ecosystem, convertible to DWC tokens at TGE. Earned through engagement, purchased via Stripe, and used for tipping or premium features. Features atomic transaction handling. (Note: Internal code uses "orbs-service.ts" for historical reasons)
- **Subscription System**: Unified subscription management synced with the main Pulse app. Tiers include Pulse Pro, StrikeAgent Elite, and DarkWave Complete. Features 2-day free trials, webhook handlers, and cross-app entitlement checking.
- **Guardian Certification Program**: In-house blockchain security audit service with tiers: Self-Cert, Assurance Lite, Guardian Premier. Uses a 6-pillar methodology and a 6-step certification process. Includes a public registry of certified projects.
- **Guardian Shield**: Continuous blockchain security monitoring service. Tiers include Guardian Watch, Guardian Shield, and Guardian Command. Offers 24/7 smart contract monitoring, threat detection, multi-chain coverage, and instant alerts.
- **Security Infrastructure**: Helmet.js security headers with environment-aware CSP, CORS with strict origin allowlist, rate limiting, AES-256-GCM encryption, HMAC-SHA256 signatures, and parameterized SQL via Drizzle ORM.
- **Early Adopter Rewards System**: Tracks signup positions and tiered crowdfund bonuses for DWC airdrops and bonuses at Token Generation Event (February 14, 2026). API: `/api/user/early-adopter-stats` (authenticated), `/api/early-adopter/counters` (public). Rewards page at `/rewards`.
- **Backend IDE / Studio Executor**: Docker container orchestration for code execution (`server/studio-executor.ts`), designed for self-hosted deployment (not runnable on Replit). Requires JWT auth, sandboxing, network policies, curated images, resource enforcement, quotas, and WebSocket log streaming for full implementation.

### Innovation Hub Features (v1.3.0)
- **Guardian Security Scores**: Real-time project security ratings (0-100) with 7 components: code quality, vulnerability, access control, upgradeability, test coverage, documentation, overall. Insurance eligibility tracking. API: `/api/guardian/security-scores`.
- **ChronoPass Identity**: Unified cross-app identity with reputation system (0-1000 scale). Trust levels: newcomer, member, trusted, veteran, legend. Passkey/WebAuthn support. Reputation components: community, trading, gaming, developer, governance. Staking boosts. API: `/api/chronopass/identity`, `/api/chronopass/reputation/:userId`.
- **Experience Shards**: Dedicated execution lanes for different use cases (gaming, defi, nft, social, ai, custom). Each shard has performance SLAs (target latency, TPS, uptime), autoscaling, and billing. Currently 6 shards active. API: `/api/shards`, `/api/shards/stats/network`.
- **Quest Mining System**: Verifiable contribution rewards with daily/weekly/seasonal/achievement quests. Categories: social, trading, gaming, development, governance, community. Rewards in Shells, DWC, and reputation. Seasonal leaderboards. Genesis Season active with 100,000 DWC prize pool. API: `/api/quests`, `/api/quests/seasons`, `/api/quests/leaderboard/:seasonId`.
- **Reality Layer Oracles**: On-chain notarization for game outcomes and real-world events. Oracle types: game_outcome, esports, market_data, random, real_world. Multi-chain verification (DWSC + Ethereum + Solana). API: `/api/oracles`, `/api/oracles/:id/feeds`.
- **AI Verified Execution**: Cryptographic proofs for AI decisions. Proof types: commitment, zk_proof, tee_attestation. Registered models: GPT-4o, Claude 3 Sonnet, Guardian Security Analyzer, Studio Copilot. API: `/api/ai/proofs`, `/api/ai/models`.
- **Guardian Studio Copilot**: AI-powered smart contract generator with automatic security audits. Contract types: token, nft, staking, dao, custom. Session-based workflow with conversation history. API: `/api/copilot/sessions`.
- **Innovation Hub Page**: Dashboard at `/innovation` showcasing all new features with live data from shards, quests, oracles, and AI models.
- **AI Agent Marketplace** (`/ai-agents`): Autonomous AI agent deployment platform. Agent types: trading, portfolio, quest, social, analytics, security, defi, gaming. Creators earn 80% revenue share on agent subscriptions. Features agent verification, deployment management, execution tracking, and performance analytics. API: `/api/ai-agents`, `/api/ai-agents/stats`, `/api/ai-agents/:id/deploy`.
- **RWA Tokenization** (`/rwa`): Real-world asset tokenization platform for institutional-grade investment. Asset types: real_estate, equity, bonds, collectibles, intellectual_property, commodities. Features Guardian-verified assets, fractional ownership, dividend distribution, and secondary market trading. Minimum $100 investment, multi-jurisdiction compliance. API: `/api/rwa/assets`, `/api/rwa/tokens`, `/api/rwa/stats`.

### Strategic Marketing Pages
- **Competitive Analysis** (`/token-compare`): Feature matrix comparing DarkWave vs Solana/Avalanche/Polygon/Arbitrum. Highlights 9 unique features no competitor has: Guardian Security Scores, Verifiable AI Execution, ChronoPass Identity, Experience Shards, Quest Mining, Reality Oracles, Guardian Studio Copilot, AI Agent Marketplace, RWA Tokenization.
- **Investor Pitch** (`/investor-pitch`): Investment thesis with 6 key points, tokenomics breakdown (100M DWC supply), roadmap milestones (Q4 2025 - Q4 2026), team highlights, and competitive advantages.
- **Innovation Hub** (`/innovation`): Premium bento grid dashboard showcasing all differentiating features with live API data.

### Games Arcade
Full arcade with classic games: Tetris, Pacman, Snake, Solitaire, Spades, Minesweeper, Galaga, Coinflip, Crash, Slots, Lottery, Predictions. Leaderboards, player profiles, and Shells economy integration.

## Project Statistics (Audit Verified)
- **Frontend Pages**: 122+ React pages with premium UI
- **API Endpoints**: 470+ routes with comprehensive error handling
- **Database Tables**: 172 PostgreSQL tables via Drizzle ORM
- **Schema Size**: 4,500+ lines of type-safe definitions
- **Rate Limiters**: 16+ endpoint-specific rate limiters
- **Blockchain Height**: 900,000+ blocks produced
- **Security**: Helmet.js, CORS, AES-256-GCM, HMAC-SHA256, timing-safe comparisons

## External Dependencies
- **Database**: PostgreSQL (172 tables)
- **Authentication**: Firebase Auth, WebAuthn/Passkeys
- **Payments**: Stripe (fully configured), Coinbase Commerce
- **Hub API**: https://orbitstaffing.io
- **AI**: OpenAI GPT-4o (via Replit AI Integrations)
- **Social**: Twitter/X, Discord, Telegram, Facebook automation