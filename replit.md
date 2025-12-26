# DarkWave Smart Chain - Replit Agent Guide

## Overview

DarkWave Smart Chain (DSC) is a blockchain ecosystem by DarkWave Studios, designed to be a high-performance alternative to existing blockchains. It features a Layer 1 Proof-of-Authority blockchain and the DarkWave Portal, a React web application serving as an ecosystem interface, block explorer, and developer hub. The project also includes "DarkWave Chronicles," a fantasy-themed game with a living political simulation and community-driven content. The ecosystem operates across four key domains: dwsc.io (main blockchain portal), darkwavegames.io (gaming), darkwavestudios.io (parent company site), and yourlegacy.io (Chronicles standalone). The overall ambition is to create a comprehensive, high-speed, and feature-rich blockchain environment with a premium user experience and innovative gaming.

## User Preferences

- Preferred communication style: Simple, everyday language
- User wants: Full blockchain implementation, not just a web portal. No piggybacking on other chains.
- Design: Premium UI with extensive visual effects ("everything should sparkle and shine")
- Mobile: Mobile-first design with self-contained carousels, accordions, dropdowns
- Branding: White-labeled, no Replit branding, dark theme only

## System Architecture

### UI/UX Decisions
The design philosophy mandates a "Premium UI Protocol" for all new components and pages from inception, ensuring a consistent high-end aesthetic. This includes:
- **Visuals**: Glassmorphism (`backdrop-blur`, semi-transparent backgrounds), holographic borders with glow effects, gradient overlays, and floating ambient glow orbs.
- **Interactivity**: Framer Motion for entrance animations, staggered delays, scale on hover, and icon animations. Hover effects (scale, glow, border color changes) on all clickable elements.
- **Layout**: Bento grids with varied card sizes, full-width hero sections with photorealistic backgrounds, and diverse card styles.
- **Mobile-First**: Touch targets ≥48px, self-contained horizontal carousels, accordions for dense content, and testing for 375px viewport width.
- **Typography & Branding**: Gradient text for headlines, premium badges, uppercase tracking for labels.
- **Color Palette**: Primary use of Cyan, Purple, and Pink for accents and gradients, with `slate-950`, `slate-900`, `slate-800` for backgrounds, and white/gray for text.

### Technical Implementations
- **Blockchain**: Proof-of-Authority (PoA) with Founders Validator, PostgreSQL for data storage, SHA-256/Merkle trees/HMAC-SHA256 cryptography, 400ms block time, and 200K+ TPS. Native token DWC (100M supply, 18 decimals, no burn).
- **Web Portal (Frontend)**: React 18, TypeScript, Vite, Wouter, TanStack Query, Tailwind CSS v4, Framer Motion.
- **Web Portal (Backend)**: Node.js, Express.js, TypeScript, Drizzle ORM, PostgreSQL.
- **Authentication**: Replit Auth (OAuth 2.0), WebAuthn/Passkeys.
- **Payments**: Stripe, Coinbase Commerce.
- **Multi-PWA**: Host-based routing for various ecosystem domains.
- **DeFi Features**: Testnet Faucet, AMM-style DEX/Token Swap, NFT Marketplace & Gallery, Portfolio Dashboard, Transaction History, Token Launchpad, Liquidity Pools, NFT Creator Tool, Price Charts (Recharts), Webhook/Events API, Liquid Staking (stDWC).
- **Cross-Chain Bridge**: Lock & mint mechanism (DWC ↔ wDWC) for Ethereum Sepolia and Solana Devnet, utilizing UUPS Proxy for Ethereum and BPF Loader for Solana.
- **DarkWave Chronicles (Flagship Game)**: An epic adventure where players embody their "parallel self" across 70+ historical eras. Key design principles include player-as-prime-hero, living worlds, impactful choices, and progression without grind. Messaging focuses on "missions," "campaigns," and "legend-building." The game incorporates a "Many Lenses Design" where the world adapts to player beliefs and an AI engine (planned) with a 5-Axis Emotion System and Belief System Layer.

## External Dependencies

- **Database**: PostgreSQL
- **Authentication**: Replit Auth, WebAuthn
- **Payments**: Stripe, Coinbase Commerce
- **Hub API**: https://orbitstaffing.io (HMAC-SHA256 authenticated)
- **AI**: OpenAI (for TTS and AI code assistant)