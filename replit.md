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
- **Community Hub**: White-labeled platform with community creation, channels, real-time WebSocket messaging, reactions, replies, file uploads, member management, and a bot framework.
- **Orbs Economy System**: Internal virtual currency for the ecosystem pre-DWC launch. Users earn Orbs through engagement, purchase via Stripe, tip other users, and unlock premium features. At DWC token launch, Orbs convert to DWC tokens. Features atomic transaction handling for tipping to prevent double-spending. Tables: orb_wallets, orb_transactions, orb_conversion_snapshots. Earn rates: daily_login (5), send_message (1), receive_reaction (2), join_community (10), referral_signup (50). Packages: Starter (100/$4.99), Popular (500/$19.99), Premium (1200/$39.99), Ultimate (3000/$79.99).

## External Dependencies
- **Database**: PostgreSQL
- **Authentication**: Replit Auth, WebAuthn
- **Payments**: Stripe, Coinbase Commerce
- **Hub API**: https://orbitstaffing.io
- **AI**: OpenAI (via Replit AI Integrations)