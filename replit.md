# DarkWave Smart Chain - Replit Agent Guide

## Overview
DarkWave Smart Chain (DSC) is a blockchain ecosystem by DarkWave Studios, designed as a high-performance alternative to existing blockchains. It features a Layer 1 Proof-of-Authority (PoA) blockchain and the DarkWave Portal, a React web application that serves as an ecosystem interface, block explorer, and developer hub. The project also includes "DarkWave Chronicles," a fantasy-themed game with a living political simulation and community-driven content. The ecosystem spans four key domains: dwsc.io (main blockchain portal), darkwavegames.io (gaming), darkwavestudios.io (parent company site), and yourlegacy.io (Chronicles standalone). The overarching goal is to deliver a comprehensive, high-speed, and feature-rich blockchain environment with a premium user experience and innovative gaming.

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
- **DarkWave Chronicles (Flagship Game)**: Player-as-prime-hero, living worlds, impactful choices, progression without grind. Messaging focuses on "missions," "campaigns," and "legend-building." Incorporates "Many Lenses Design" and a planned AI engine with a 5-Axis Emotion System and Belief System Layer.
- **Chronicles Personality AI System**: Proprietary system for "Parallel Self" experience, learning from player choices, beliefs, and emotional responses. Features a 5-Axis Emotion System (Courage/Fear, Hope/Despair, Trust/Suspicion, Passion/Apathy, Wisdom/Recklessness). Emphasizes no moral alignment, archetypes, or predetermined categories.
- **Credits System**: Manages costs for AI chat, scenario generation, voice cloning, and personality summaries.
- **Voice Cloning Technology**: Allows players' parallel selves to speak with their actual voice. Uses Web Audio API for recording and integrates with external APIs for synthesis.
- **Owner Admin Portal**: Secure portal (`/owner-admin`) for system administrators with `OWNER_SECRET` authentication, rate limiting, and lockout mechanisms.
- **Marketing Automation System**: Proprietary auto-deployment system for social media (Twitter/X, Facebook, Discord, Telegram) with scheduled posts and category rotation.
- **Payment Infrastructure**: Handles crowdfund donations and token presales with Stripe integration and webhook processing.
- **Pre-Launch Airdrop System**: Manages affiliate commissions for pre-launch, distributed as DWC tokens at launch, using a dual-ledger design.
- **Community Hub**: White-labeled platform with community creation, channels, real-time messaging (polling-based, WebSockets planned), member management, and a bot framework.

## External Dependencies
- **Database**: PostgreSQL
- **Authentication**: Replit Auth, WebAuthn
- **Payments**: Stripe, Coinbase Commerce
- **Hub API**: https://orbitstaffing.io
- **AI**: OpenAI (via Replit AI Integrations)