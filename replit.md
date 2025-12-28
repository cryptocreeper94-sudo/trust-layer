# DarkWave Smart Chain - Replit Agent Guide

## Overview
DarkWave Smart Chain (DSC) is a blockchain ecosystem by DarkWave Studios, designed as a high-performance alternative to existing blockchains. It features a Layer 1 Proof-of-Authority (PoA) blockchain and the DarkWave Portal, a React web application that serves as an ecosystem interface, block explorer, and developer hub. The project also includes "DarkWave Chronicles," a fantasy-themed game with a living political simulation and community-driven content. The ecosystem spans five key domains: dwsc.io (main blockchain portal), darkwavegames.io (gaming), darkwavestudios.io (parent company site), yourlegacy.io (Chronicles standalone), and chronochat.io (community hub). The overarching goal is to deliver a comprehensive, high-speed, and feature-rich blockchain environment with a premium user experience and innovative gaming.

## User Preferences
- Preferred communication style: Simple, everyday language
- User wants: Full blockchain implementation, not just a web portal. No piggybacking on other chains.
- Design: Premium UI with extensive visual effects ("everything should sparkle and shine")
- Mobile: Mobile-first design with self-contained carousels, accordions, dropdowns
- Branding: White-labeled, no Replit branding, dark theme only
- Stripe: FULLY CONFIGURED - do not ask about Stripe keys, payments are ready

## System Architecture

### UI/UX Decisions
The design adheres to a "Premium UI Protocol" featuring:
- **Visuals**: Glassmorphism, holographic borders with glow, gradient overlays, and floating ambient glow orbs.
- **Interactivity**: Framer Motion for entrance animations, staggered delays, scale on hover, and icon animations. Hover effects on all clickable elements.
- **Layout**: Bento grids, full-width hero sections with photorealistic backgrounds, and diverse card styles.
- **Mobile-First**: Touch targets ≥48px, self-contained horizontal carousels, accordions, and testing for 375px viewport width.
- **Typography & Branding**: Gradient text for headlines, premium badges, uppercase tracking for labels.
- **Color Palette**: Cyan, Purple, and Pink for accents and gradients, with `slate-950`, `slate-900`, `slate-800` for backgrounds, and white/gray for text.

### Technical Implementations
- **Blockchain**: Proof-of-Authority (PoA) with Founders Validator, PostgreSQL for data, SHA-256/Merkle trees/HMAC-SHA256 cryptography, 400ms block time, and 200K+ TPS. Native token DWC (100M supply, 18 decimals, no burn). Revenue from protocol fees (DEX 0.3%, NFT marketplace 2.5%, bridge 0.1%, launchpad listings).
- **Web Portal (Frontend)**: React 18, TypeScript, Vite, Wouter, TanStack Query, Tailwind CSS v4, Framer Motion.
- **Web Portal (Backend)**: Node.js, Express.js, TypeScript, Drizzle ORM, PostgreSQL.
- **Authentication**: Replit Auth (OAuth 2.0), WebAuthn/Passkeys.
- **Payments**: Stripe, Coinbase Commerce.
- **Multi-PWA**: Host-based routing for various ecosystem domains.
- **DeFi Features**: Testnet Faucet, AMM-style DEX/Token Swap, NFT Marketplace & Gallery, Portfolio Dashboard, Transaction History, Token Launchpad, Liquidity Pools, NFT Creator Tool, Price Charts (Recharts), Webhook/Events API, Liquid Staking (stDWC).
- **Cross-Chain Bridge**: Lock & mint mechanism (DWC ↔ wDWC) for Ethereum Sepolia and Solana Devnet, utilizing UUPS Proxy for Ethereum and BPF Loader for Solana.
- **DarkWave Chronicles (Parallel Life Experience)**: NOT a traditional RPG. A revolutionary social experiment and parallel life simulation where you experience yourself as YOU in different eras of history and beyond. Core philosophy:
  - **Parallel Self Mirror**: Chronicles holds a mirror to who you truly are. Your choices reveal your character - bad choices lead to hardship, good choices to prosperity (but not always, just like real life).
  - **Quantum Leap Freedom**: Start in ANY era you choose. No forced progression, no unlocking. Time-warp between eras based on achievements, permanently or temporarily.
  - **Living Persistent World**: The world continues 24/7 whether you're there or not. Other players affect the same world. Your actions ripple through time.
  - **Belief System Integration**: Your faith, deities, atheism, agnosticism - whatever shapes you in real life shapes your experience. No moral labels, no "good vs evil" paths.
  - **Emotion-Driven AI**: The world and its inhabitants react based on genuine human emotion patterns, not scripted responses. The AI learns from your choices, beliefs, and emotional responses.
  - **"The Veil is Lifting" Theme**: Truth revelation, self-discovery. Missions may involve awakening others, uncovering hidden truths, seeing reality clearly.
  - **NEVER Use**: Levels, XP, skill trees, quests, character classes as fixed paths, "journey begins here," unlock requirements, linear progression language.
  - **TRIGGER PHRASE**: "Let's revisit Chronicles" = Review all Chronicles philosophy and messaging to ensure alignment.
- **Chronicles Personality AI System**: Proprietary "Parallel Self" system learning from player choices, beliefs, and emotional responses. Features a 5-Axis Emotion System (Courage/Fear, Hope/Despair, Trust/Suspicion, Passion/Apathy, Wisdom/Recklessness). NO moral alignment, NO archetypes, NO predetermined categories. You are always YOU.
- **Credits System**: Manages costs for AI chat, scenario generation, voice cloning, and personality summaries.
- **Voice Cloning Technology**: Allows players' parallel selves to speak with their actual voice. Uses Web Audio API for recording and integrates with external APIs for synthesis.
- **Owner Admin Portal**: Secure portal (`/owner-admin`) for system administrators with `OWNER_SECRET` authentication, rate limiting, and lockout mechanisms.
- **Marketing Automation System**: Proprietary auto-deployment system for social media (Twitter/X, Facebook, Discord, Telegram) with scheduled posts and category rotation.
- **Payment Infrastructure**: Handles crowdfund donations and token presales with Stripe integration and webhook processing.
- **Pre-Launch Airdrop System**: Manages affiliate commissions for pre-launch, distributed as DWC tokens at launch, using a dual-ledger design.
- **ChronoChat Platform (Community Hub)**: Standalone community platform at chronochat.io with tiered product offerings. Tagline: "Connect across timelines. Chat beyond eras." Features cyan-to-purple gradient branding.
  - **Product Tiers (in order of priority)**:
    1. **ChronoChat for Communities** (Priority #1, Q4 2025): Core platform with channels, reactions, Orbs integration, moderation tools. Pricing: Free / $19 / $49 / $99 monthly tiers.
    2. **ChronoChat Cloud** (Priority #2, Q1 2026): SaaS hosting for partner communities. Multi-tenant provisioning, billing integration. Pricing: $149+/month.
    3. **ChronoChat for Gaming** (Priority #3, Q2-Q3 2026): Gaming overlays with matchmaking lobbies, game telemetry hooks, Orbs rewards. Launches alongside Chronicles beta.
    4. **ChronoChat for Teams** (Deferred, Late 2026+): Enterprise collaboration (tasks, docs, compliance). Wait for demand validation.
    5. **ChronoChat API** (Deferred, Late 2026+): Developer API with rate limits, keys, documentation. Open after public beta stability.
  - **Core Features**: Community creation, channels, real-time WebSocket messaging, reactions, replies, file uploads, member management, bot framework.
- **Orbs Economy System**: Internal virtual currency for the ecosystem pre-DWC launch. Users earn Orbs through engagement, purchase via Stripe, tip other users, and unlock premium features. At DWC token launch, Orbs convert to DWC tokens. Features atomic transaction handling for tipping to prevent double-spending. Tables: orb_wallets, orb_transactions, orb_conversion_snapshots. Earn rates: daily_login (5), send_message (1), receive_reaction (2), join_community (10), referral_signup (50). Packages: Starter (100/$4.99), Popular (500/$19.99), Premium (1200/$39.99), Ultimate (3000/$79.99).
- **Subscription System**: Unified subscription management synced with main Pulse app. Tiers: Pulse Pro ($14.99/mo, $149.99/yr), StrikeAgent Elite ($30/mo, $300/yr), DarkWave Complete ($39.99/mo, $399.99/yr). Features 2-day free trials, webhook handlers for lifecycle events (renewals, cancellations, payment failures), whitelist support for team/partners, and cross-app entitlement checking via /api/subscription/status. Tables: subscriptions, whitelisted_users. Plan IDs: pulse_pro, strike_agent, complete_bundle, founder, rm_monthly, rm_annual.
- **Guardian Certification Program**: In-house blockchain security audit service offering enterprise-grade audits at 70% less than traditional firms like CertiK.
  - **Tiers**: Self-Cert (Free, quarterly for ecosystem projects), Assurance Lite ($5,999), Guardian Premier ($14,999)
  - **Methodology**: 6-pillar approach (Threat Modeling, Static Analysis, Dynamic Testing, Infrastructure Audit, Cryptographic Review, Compliance Mapping)
  - **Process**: 6-step certification (Engagement → Discovery → Assessment → Findings → Remediation → Certification)
  - **Registry**: Public listing of certified projects with scores and status
  - **Revenue Stream**: New services revenue from external project audits
  - **Pages**: /security (transparency report, 78/100 score), /guardian (certification program)
  - **Trust Center**: Downloadable methodology docs, sample findings reports, DWSC self-audit report
  - **Pioneer Program**: First 5 audits with 50% deposit model and exclusive benefits
  - **Validation Roadmap**: 5-phase journey to credibility (Phase 0-4, ending Feb 2026)
- **Guardian Shield (Coming Q3 2025)**: Continuous blockchain security monitoring service - "Norton for blockchain"
  - **Tiers**: Guardian Watch ($299/mo), Guardian Shield ($999/mo), Guardian Command ($2,999/mo)
  - **Features**: 24/7 smart contract monitoring, threat detection, multi-chain coverage, instant alerts
  - **Capabilities**: Real-time anomaly detection, governance attack detection, rug pull early warning, SOC operations
  - **Status**: Coming Soon with waitlist signup
- **Security Infrastructure**: Helmet.js security headers with environment-aware CSP (strict in production), CORS with strict origin allowlist (5 ecosystem domains only), 10+ rate limiting categories, AES-256-GCM encryption, HMAC-SHA256 signatures, parameterized SQL via Drizzle ORM. Internal security score: 78/100 (50% above industry average).

## External Dependencies
- **Database**: PostgreSQL
- **Authentication**: Replit Auth, WebAuthn
- **Payments**: Stripe, Coinbase Commerce
- **Hub API**: https://orbitstaffing.io
- **AI**: OpenAI (via Replit AI Integrations)