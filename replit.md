# DarkWave Trust Layer - Replit Agent Guide

## Overview
DarkWave Trust Layer (DWTL) is a high-performance Layer 1 Proof-of-Authority (PoA) blockchain ecosystem designed as a **Coordinated Trust Layer**. Its purpose is to provide verified identity, accountability, and transparent audit trails for real business operations, moving beyond traditional blockchain focuses. The project includes the DarkWave Portal, a comprehensive React web application serving as an ecosystem interface and block explorer, and "DarkWave Chronicles," a fantasy-themed game focused on a living political simulation. The core ambition is to deliver a fast, feature-rich trust infrastructure with a premium user experience and innovative gaming across four key domains: dwsc.io, darkwavegames.io, darkwavestudios.io, and yourlegacy.io. DWTL uses blockchain technology but emphasizes its value proposition as a "Trust Layer" for enterprises seeking trusted business relationships.

## User Preferences
- Preferred communication style: Simple, everyday language
- User wants: Full blockchain implementation, not just a web portal. No piggybacking on other chains.
- Design: Premium UI with extensive visual effects ("everything should sparkle and shine")
- Mobile: Mobile-first design with self-contained carousels, accordions, dropdowns
- Branding: White-labeled, no Replit branding, dark theme only
- Stripe: FULLY CONFIGURATED - do not ask about Stripe keys, payments are ready

## System Architecture

### UI/UX Decisions - MANDATORY PREMIUM UI PROTOCOL
Every new page MUST be built with the Ultra-Premium Bento Grid LED Protocol, incorporating: Floating Ambient Orbs, Glassmorphism, Holographic Glow, Framer Motion animations, Gradient Headlines, Bento Grid Layouts, Premium Badges, and Mobile-First design. The color palette uses Cyan/Purple/Pink accents with dark backgrounds. `GlassCard` component with `glow` prop enabled is required.

### Technical Implementations
- **Blockchain**: BFT-PoA consensus, stake-weighted validator selection, PostgreSQL state, SHA-256/Merkle trees, 400ms block time, 200K+ TPS. Includes validator staking, slashing, epoch-based finality, and node sync APIs. Native asset: Signal (SIG).
- **Web Portal (Frontend)**: React 18, TypeScript, Vite, Wouter, TanStack Query, Tailwind CSS v4, Framer Motion.
- **Web Portal (Backend)**: Node.js, Express.js, TypeScript, Drizzle ORM, PostgreSQL.
- **Authentication**: Firebase Auth (multiple providers), server-side Firebase token verification, WebAuthn/Passkeys, PIN authentication.
- **Multi-PWA**: Host-based routing for ecosystem domains.
- **DeFi Features**: Testnet Faucet, AMM-style DEX/Token Swap, NFT Marketplace & Gallery, Portfolio Dashboard, Transaction History, Token Launchpad, Liquidity Pools, NFT Creator Tool, Price Charts (Recharts), Webhook/Events API, Liquid Staking (stSIG).
- **Cross-Chain Bridge**: Lock & mint (SIG ↔ wSIG) for Ethereum Sepolia and Solana Devnet.
- **DarkWave Chronicles**: A social experiment and parallel life simulation with a persistent world and emotion-driven AI, focusing on self-discovery.
- **Credits System**: Manages costs for AI chat, scenario generation, voice cloning, and personality summaries.
- **Owner Admin Portal**: Secure portal (`/owner-admin`) with `OWNER_SECRET` authentication, rate limiting, and lockout.
- **Marketing Automation System**: Proprietary auto-deployment system for social media.
- **Payment Infrastructure**: Handles crowdfund donations and token presales with Stripe integration.
- **Pre-Launch Airdrop System**: Manages affiliate commissions for pre-launch, distributed as Signal, using a dual-ledger design.
- **ChronoChat Platform**: Standalone community platform at chronochat.io with real-time WebSocket messaging and bot framework.
- **Shells Economy System**: Pre-launch virtual currency, convertible to Signal, earned through engagement, purchased via Stripe, and used for tipping/premium features, with atomic transaction handling.
- **Subscription System**: Unified subscription management synced with the main Pulse app, with tiers and cross-app entitlement checking.
- **Guardian Certification Program**: In-house blockchain security audit service with tiered offerings and a public registry.
- **Guardian Shield**: Continuous blockchain security monitoring service with threat detection and instant alerts.
- **Security Infrastructure**: Helmet.js security headers, CORS, rate limiting, AES-256-GCM encryption, HMAC-SHA256 signatures, and parameterized SQL.
- **Early Adopter Rewards System**: Tracks signup positions and tiered crowdfund bonuses for Signal airdrops, accessible via `/api/user/early-adopter-stats` and `/api/early-adopter/counters`, with a rewards page at `/rewards`.
- **Backend IDE / Studio Executor**: Docker container orchestration for code execution (`server/studio-executor.ts`), designed for self-hosted deployment, requiring JWT auth, sandboxing, and resource enforcement.
- **Innovation Hub Features**: Includes Guardian Security Scores, ChronoPass Identity (unified cross-app identity with reputation and Passkey/WebAuthn), Experience Shards (dedicated execution lanes with performance SLAs), Quest Mining System (verifiable contribution rewards), Zealy Integration (community questing platform), Reality Layer Oracles (on-chain notarization for game/real-world events), AI Verified Execution, Guardian Studio Copilot (AI smart contract generator), AI Agent Marketplace, and RWA Tokenization.
- **Strategic Marketing Pages**: Competitive Analysis (`/token-compare`), Investor Pitch (`/investor-pitch`), Innovation Hub (`/innovation`) dashboard.
- **Business Tenant Portals**: Secure B2B dashboards for verified companies on the Trust Layer, featuring dashboards, transaction ledgers, trusted networks, team access, compliance centers, API access, and Multi-SIG Treasuries.
- **Multi-SIG Multi-Chain Wallet**: M-of-N signature requirements across all supported chains for business treasuries, DAO governance, charity funds, escrow, and family offices, with configurable thresholds and full audit trails.
- **DarkWave Academy**: Education and certification platform for crypto fundamentals, multi-chain ecosystems, DeFi, security, bridging, and Trust Layer operations, with Bronze, Silver, Gold certification tiers and a mentor network. Also marketed as standalone acquisition channel - "unbiased crypto education" leads people into Trust Layer ecosystem upon certification. Seek influencer endorsements for credibility. Pricing strategy: near-free (loss leader) - course is the acquisition funnel, not the profit center. Covers all personas: scared newcomers, burned learners, experienced users wanting verification badge.
- **Signal Foundation (Charitable Arm)**: Trust Layer-native charity infrastructure proving where every donation goes. Initial focus: no-kill animal shelters (chronically underfunded, volunteer-dependent). Expands to multiple causes. Key differentiator: 95%+ donation-to-cause ratio with on-chain proof. Solves the charity trust problem - donors see exactly where funds go. Verified recipients through Guardian certification. Model after Salvation Army's efficiency. Name options: "Signals," "Signal Foundation," "Trust Layer Giving." Mission: healing wounds caused by ignorance and indifference, giving back as core value.

## External Dependencies
- **Database**: PostgreSQL
- **Authentication**: Firebase Auth
- **Payments**: Stripe, Coinbase Commerce
- **Hub API**: https://orbitstaffing.io
- **AI**: OpenAI GPT-4o (via Replit AI Integrations)
- **Social**: Twitter/X, Discord, Telegram, Facebook automation