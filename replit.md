# DarkWave Smart Chain - Replit Agent Guide

## Overview

DarkWave Smart Chain (DSC) is a comprehensive blockchain ecosystem developed by DarkWave Studios, designed to surpass Solana and Ethereum in speed, stability, and features. It includes a Layer 1 Proof-of-Authority blockchain and the DarkWave Portal, a React web application serving as the ecosystem's interface, block explorer, and developer hub. The project also envisions "DarkWave Chronicles," a fantasy-themed game with a living political simulation and community-driven creation. The ecosystem is structured across three domains: dwsc.io (main blockchain portal), darkwavegames.io (gaming), and darkwavestudios.io (parent company site).

## User Preferences

- Preferred communication style: Simple, everyday language
- User wants: Full blockchain implementation, not just a web portal. No piggybacking on other chains.
- Design: Premium UI with extensive visual effects ("everything should sparkle and shine")
- Mobile: Mobile-first design with self-contained carousels, accordions, dropdowns
- Branding: White-labeled, no Replit branding, dark theme only

## System Architecture

### Blockchain Architecture (`server/blockchain-engine.ts`)
- **Consensus**: Proof-of-Authority (PoA) with the Founders Validator
- **Storage**: PostgreSQL (chain_blocks, chain_transactions, chain_accounts)
- **Cryptography**: SHA-256, Merkle trees, HMAC-SHA256
- **Performance**: 400ms block time, 200K+ TPS capacity
- **Token**: DWC - 100M total supply, 18 decimals, NO burn

### Web Portal Architecture
- **Frontend**: React 18, TypeScript, Vite, Wouter, TanStack Query, Tailwind CSS v4, Framer Motion
- **Backend**: Node.js, Express.js, TypeScript, Drizzle ORM, PostgreSQL
- **Auth**: Replit Auth (OAuth 2.0), WebAuthn/Passkeys
- **Payments**: Stripe (cards), Coinbase Commerce (crypto)
- **Multi-PWA**: Host-based routing serves distinct PWA manifests, themes, and installable experiences for `dwsc.io`, `darkwavegames.io`, and `darkwavestudios.io` from a shared backend.

### DarkWave Studio
- **Editor**: Monaco v0.52.2 via CDN (70+ language support)
- **Features**: File tree, multi-file tabs, Git integration, simulated terminal, deployment UI (.darkwave.app URLs, custom domains), package manager, environment variables, project templates, global search/replace, keyboard shortcuts, real-time collaboration presence, Live Preview iframe with hot reload, Database Explorer UI, CI/CD Pipeline configuration.
- **AI Assistant**: Voice-enabled (OpenAI TTS), ecosystem guidance, credit-based billing for Studio AI features.

### DeFi Features
- **Core**: Testnet Faucet, DEX/Token Swap (AMM-style DWC/USDC/wETH/wSOL/USDT pairs), NFT Marketplace, Portfolio Dashboard, Transaction History.
- **Advanced**: Token Launchpad, Liquidity Pools, NFT Gallery, NFT Creator Tool, Price Charts (Recharts), Webhook/Events API, Liquid Staking (stDWC with 12% APY).

### Cross-Chain Bridge
- **Functionality**: Lock & mint for DWC → wDWC, burn & release for wDWC → DWC.
- **Supported Chains**: Ethereum Sepolia & Solana Devnet.
- **Contracts**: wDWC ERC-20 contract (`contracts/ethereum/WDWC.sol`), wDWC Solana bridge program (`contracts/solana/programs/wdwc-bridge/`).
- **Governance**: Multi-sig validator committee UI, Proof-of-reserve dashboard.

### Contract Architecture (Developer Reference)
- **Ethereum (wDWC.sol)**: UUPS Proxy Pattern for upgradeability.
- **Solana (wdwc-bridge)**: BPF Loader with `upgrade_authority` and `protocol_version`.
- **Governance**: DSC Improvement Proposal (DSCIP) process for updates, including Testnet, Canary, and Mainnet deployment stages with rollback plans. Security controls include governance authority, emergency stop functions, multi-sig readiness, version tracking, and timelocks.

## External Dependencies

- **Database**: PostgreSQL (via DATABASE_URL)
- **Authentication**: Replit Auth, WebAuthn
- **Payments**: Stripe, Coinbase Commerce
- **Hub API**: https://orbitstaffing.io (HMAC-SHA256 authenticated)
- **AI**: OpenAI (for TTS and AI code assistant)

---

## DarkWave Chronicles - AI Life Generator Blueprint

**Core Philosophy**: No good guys. No bad guys. Only free will and consequences.

### Emotion System (5-Axis Model)

| Axis | Range | Affects |
|------|-------|---------|
| **Arousal** | Calm ↔ Agitated | Reaction speed, impulsiveness |
| **Valence** | Sad ↔ Happy | Cooperation, risk-taking |
| **Social Cohesion** | Isolated ↔ Bonded | Loyalty, betrayal threshold |
| **Fear** | Secure ↔ Terrified | Fight/flight decisions |
| **Ambition** | Content ↔ Driven | Power-seeking behavior |

- Emotions decay over time but can spike (overreactions)
- Emotional contagion spreads through proximity and relationships
- Collective emotion states trigger world events

### Free Will Framework (No Alignment)

- **Consequence Webs**: Actions update world variables (stability, scarcity, influence)
- **Reputational Memory**: NPCs remember what you did, not moral judgment
- **Multi-Criteria Utility**: Decisions based on goals + emotions + situation

### Agent Schema

Each AI life has: identity seed, traits, needs, motivations, relationships, memory shards, lifecycle (birth → death → legacy)

### AI Stack (3-Tier)

1. Deterministic Planners - Day-to-day (fast, cheap)
2. LLM Microservices - Dialogue, reactions (OpenAI)
3. Offline LLM Batches - Major historical events

### MVP Roadmap

- **Phase 0** (3-4 mo): Single-era sandbox, 200 agents, emotion dashboard
- **Phase 1** (6-8 mo): Faction councils, treaties, player crises
- **Phase 2** (12+ mo): Multi-era, time-travel echoes, full scale