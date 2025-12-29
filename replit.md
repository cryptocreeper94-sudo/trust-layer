# DarkWave Smart Chain - Replit Agent Guide

## Overview
DarkWave Smart Chain (DSC) is a high-performance Layer 1 Proof-of-Authority (PoA) blockchain ecosystem developed by DarkWave Studios. It features the DarkWave Portal, a comprehensive React web application functioning as an ecosystem interface, block explorer, and developer hub. The project also includes "DarkWave Chronicles," a fantasy-themed game focused on a living political simulation and community-driven content. The ecosystem is supported by five key domains: dwsc.io, darkwavegames.io, darkwavestudios.io, yourlegacy.io, and chronochat.io. The primary objective is to deliver a fast, feature-rich blockchain environment with a premium user experience and innovative gaming.

## User Preferences
- Preferred communication style: Simple, everyday language
- User wants: Full blockchain implementation, not just a web portal. No piggybacking on other chains.
- Design: Premium UI with extensive visual effects ("everything should sparkle and shine")
- Mobile: Mobile-first design with self-contained carousels, accordions, dropdowns
- Branding: White-labeled, no Replit branding, dark theme only
- Stripe: FULLY CONFIGURED - do not ask about Stripe keys, payments are ready

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
- **Blockchain**: Proof-of-Authority (PoA) with Founders Validator, PostgreSQL, SHA-256/Merkle trees/HMAC-SHA256, 400ms block time, 200K+ TPS. Native token DWC (100M supply, 18 decimals, no burn). Revenue from protocol fees.
- **Web Portal (Frontend)**: React 18, TypeScript, Vite, Wouter, TanStack Query, Tailwind CSS v4, Framer Motion.
- **Web Portal (Backend)**: Node.js, Express.js, TypeScript, Drizzle ORM, PostgreSQL.
- **Authentication**: Replit Auth (OAuth 2.0), WebAuthn/Passkeys.
- **Payments**: Stripe, Coinbase Commerce.
- **Multi-PWA**: Host-based routing for ecosystem domains.
- **DeFi Features**: Testnet Faucet, AMM-style DEX/Token Swap, NFT Marketplace & Gallery, Portfolio Dashboard, Transaction History, Token Launchpad, Liquidity Pools, NFT Creator Tool, Price Charts (Recharts), Webhook/Events API, Liquid Staking (stDWC).
- **Cross-Chain Bridge**: Lock & mint (DWC ↔ wDWC) for Ethereum Sepolia and Solana Devnet (UUPS Proxy for ETH, BPF Loader for SOL).
- **DarkWave Chronicles (Parallel Life Experience)**: A social experiment and parallel life simulation focused on self-discovery across eras. Features a persistent world, belief system integration, and emotion-driven AI. Avoids traditional RPG elements like levels, XP, skill trees, and linear progression. The "Parallel Self" AI system uses a 5-Axis Emotion System (Courage/Fear, Hope/Despair, Trust/Suspicion, Passion/Apathy, Wisdom/Recklessness).
- **Credits System**: Manages costs for AI chat, scenario generation, voice cloning, and personality summaries.
- **Voice Cloning Technology**: Integrates Web Audio API for recording and external APIs for synthesis to allow players' parallel selves to speak with their actual voice.
- **Owner Admin Portal**: Secure portal (`/owner-admin`) with `OWNER_SECRET` authentication, rate limiting, and lockout.
- **Marketing Automation System**: Proprietary auto-deployment system for social media (Twitter/X, Facebook, Discord, Telegram).
- **Payment Infrastructure**: Handles crowdfund donations and token presales with Stripe integration.
- **Pre-Launch Airdrop System**: Manages affiliate commissions for pre-launch, distributed as DWC tokens, using a dual-ledger design.
- **ChronoChat Platform (Community Hub)**: Standalone community platform at chronochat.io. Features community creation, channels, real-time WebSocket messaging, reactions, replies, file uploads, member management, and bot framework. Product tiers prioritize "ChronoChat for Communities" (Q4 2025), followed by "ChronoChat Cloud" (Q1 2026) and "ChronoChat for Gaming" (Q2-Q3 2026).
- **Orbs Economy System**: Internal virtual currency for the ecosystem pre-DWC launch, convertible to DWC tokens. Earned through engagement, purchased via Stripe, and used for tipping or premium features. Features atomic transaction handling.
- **Subscription System**: Unified subscription management synced with the main Pulse app. Tiers include Pulse Pro, StrikeAgent Elite, and DarkWave Complete. Features 2-day free trials, webhook handlers, and cross-app entitlement checking.
- **Guardian Certification Program**: In-house blockchain security audit service with tiers: Self-Cert (Free), Assurance Lite ($5,999), Guardian Premier ($14,999). Uses a 6-pillar methodology and a 6-step certification process. Includes a public registry of certified projects.
- **Guardian Shield**: Continuous blockchain security monitoring service. Tiers include Guardian Watch ($299/mo), Guardian Shield ($999/mo), and Guardian Command ($2,999/mo). Offers 24/7 smart contract monitoring, threat detection, multi-chain coverage, and instant alerts.
- **Security Infrastructure**: Helmet.js security headers with environment-aware CSP, CORS with strict origin allowlist, rate limiting, AES-256-GCM encryption, HMAC-SHA256 signatures, and parameterized SQL via Drizzle ORM.
- **Domain Service Roadmap**: Plans for .dwsc gateway (Q1 2025), browser extension (Q2-Q3 2025), traditional TLD reseller (Q3-Q4 2025), and potential ICANN exploration (2026+).

## External Dependencies
- **Database**: PostgreSQL
- **Authentication**: Replit Auth, WebAuthn
- **Payments**: Stripe, Coinbase Commerce
- **Hub API**: https://orbitstaffing.io
- **AI**: OpenAI (via Replit AI Integrations)