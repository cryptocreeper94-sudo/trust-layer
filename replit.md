# DarkWave Smart Chain - Replit Agent Guide

## Overview

DarkWave Smart Chain (DSC) is a comprehensive blockchain ecosystem developed by DarkWave Studios. It comprises a Layer 1 Proof-of-Authority blockchain and a React web application called DarkWave Portal. The portal acts as the ecosystem's interface, a block explorer, and a developer hub. The project aims to deliver a blockchain solution that surpasses Solana and Ethereum in speed, stability, and feature richness.

**Public Launch: February 14, 2026**

## User Preferences

- Preferred communication style: Simple, everyday language
- User wants: Full blockchain implementation, not just a web portal. No piggybacking on other chains.
- Design: Premium UI with extensive visual effects ("everything should sparkle and shine")
- Mobile: Mobile-first design with self-contained carousels, accordions, dropdowns
- Branding: White-labeled, no Replit branding, dark theme only

---

## MASTER ROADMAP - CONSOLIDATED

### ✅ COMPLETED FEATURES

#### Core Blockchain
- [x] Layer 1 PoA blockchain (400ms blocks, 200K+ TPS)
- [x] PostgreSQL persistent ledger (chain_blocks, chain_transactions, chain_accounts)
- [x] SHA-256 block hashing, Merkle trees, HMAC-SHA256 signatures
- [x] DWC Coin (100M supply, 18 decimals, NO burn)
- [x] Genesis block (February 14, 2025)

#### DarkWave Portal
- [x] Block explorer with real-time stats
- [x] Wallet/address viewer
- [x] Token page with tokenomics
- [x] Staking system with rewards & leaderboards
- [x] Developer portal with API key registration
- [x] Ecosystem apps page
- [x] Mobile-responsive design
- [x] PWA support
- [x] Authentication (Replit Auth + WebAuthn)

#### Cross-Chain Bridge (Phase 1 MVP)
- [x] Lock & mint UI for DWC → wDWC
- [x] Burn & release UI for wDWC → DWC
- [x] Ethereum Sepolia & Solana Devnet support
- [x] Mock mode for testing (contracts not yet deployed)
- [x] wDWC ERC-20 contract ready (`contracts/ethereum/WDWC.sol`)
- [x] wDWC SPL token setup ready (`scripts/deploy-wdwc-solana.ts`)

#### DarkWave Studio (Phases 1-4)
- [x] Monaco code editor with 70+ language support
- [x] File tree, create/edit/delete files
- [x] Multi-file tabs with unsaved indicators
- [x] Git commits, branches, history
- [x] Simulated terminal (ls, pwd, node -v, etc.)
- [x] Deployment UI with .darkwave.app URLs
- [x] Custom domain support
- [x] Package manager (npm/pip)
- [x] Environment variables UI (dev/prod)
- [x] Project templates (React, Node.js, Python, Vue, Next.js, Django, Go, Rust)
- [x] Global search/replace
- [x] Keyboard shortcuts
- [x] Real-time collaboration presence
- [x] Live Preview iframe with hot reload
- [x] Database Explorer UI
- [x] CI/CD Pipeline configuration

#### AI Assistant
- [x] Voice-enabled AI assistant (floating button)
- [x] Human-like voice using OpenAI TTS
- [x] Ecosystem guidance and navigation help
- [x] Free with rate limiting (50/hour)
- [x] Credit system ready for Studio AI features

#### DeFi Features (Priority 1 - Complete)
- [x] Testnet Faucet - 1000 DWC per claim, 24-hour cooldown, tracks by wallet/IP
- [x] DEX / Token Swap - AMM-style swap with DWC/USDC/wETH/wSOL/USDT pairs, 0.3% fee
- [x] NFT Marketplace - Browse collections, view NFTs, mint new NFTs
- [x] Portfolio Dashboard - Track token holdings, staking positions, rewards, NFTs
- [x] Transaction History - View all swaps, claims, transfers with filters

---

#### DeFi Features (Priority 2 - Complete)
- [x] Token Launchpad - Create & launch new tokens on DarkWave (fair launch, presale, auction)
- [x] Liquidity Pools - Users provide liquidity, earn fees (AMM-style with LP tokens)
- [x] NFT Gallery - View NFT collections by wallet address
- [x] NFT Creator Tool - No-code NFT minting wizard (4-step: upload, details, attributes, mint)
- [x] Price Charts - DWC price visualization with Recharts (area/bar charts, multiple timeframes)
- [x] Webhook/Events API - Real-time notifications for devs (9 event types, HMAC-SHA256 signatures)
- [x] Liquid Staking (stDWC) - Stake DWC, receive stDWC tokens, earn 12% APY while maintaining liquidity

---

### 🔵 PRIORITY 3 - BRIDGE PRODUCTION (Q1 2026)

#### Completed (Ready for Deployment)
- [x] wDWC ERC-20 contract (`contracts/ethereum/WDWC.sol`) with Hardhat setup
- [x] wDWC Solana bridge program (`contracts/solana/programs/wdwc-bridge/`) with Anchor
- [x] Multi-sig validator committee UI (`/multisig` page)
- [x] Proof-of-reserve dashboard (`/proof-of-reserve` page)
- [x] Security audit documentation (`docs/security-audit-checklist.md`)

#### Pending (Requires External Setup)
| # | Feature | Status | Description |
|---|---------|--------|-------------|
| 12 | Deploy wDWC to Sepolia | READY | Run `cd contracts/ethereum && npm install && npm run deploy:sepolia` |
| 13 | Deploy wDWC to Solana Devnet | READY | Run `cd contracts/solana && anchor build && anchor deploy` |
| 14 | Contract verification | TODO | Verify on Etherscan/Solscan |
| 15 | External security audit | TODO | Submit to Trail of Bits / OpenZeppelin |

---

### 🟣 PRIORITY 4 - STUDIO ADVANCED (Q2 2026)

| # | Feature | Status | Description |
|---|---------|--------|-------------|
| 17 | More templates (Vue, Next.js, Django, Go, Rust) | ✅ DONE | Quick starts |
| 18 | Live Preview iframe | ✅ DONE | Hot reload for apps |
| 19 | Database Explorer | ✅ DONE | UI for project databases |
| 20 | AI Code Assistant | ✅ DONE | GPT-4o integration with credit billing ($0.05/request) |
| 21 | Billing & Quotas | ✅ DONE | Credit system for Studio AI features |
| 22 | CI/CD Pipelines | ✅ DONE | Automated testing/deploy config UI |

---

### ⚫ PRIORITY 5 - FUTURE VISION (Q3+ 2026)

| # | Feature | Status | Description |
|---|---------|--------|-------------|
| 23 | Serverless code execution | TODO | Run user code in sandboxes |
| 24 | Real-time collaboration (CRDTs) | TODO | Multi-user editing |
| 25 | Chain abstraction (LayerZero/Axelar) | TODO | Omnichain interop |
| 26 | Mobile wallet app | TODO | Native iOS/Android |
| 27 | Governance/DAO | TODO | Community voting |

---

## System Architecture

### Blockchain Architecture (`server/blockchain-engine.ts`)
**Status: MAINNET** - Production-ready Layer 1 blockchain with persistent storage.
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

### DarkWave Studio
- **Editor**: Monaco v0.52.2 via CDN
- **WebSocket**: `/ws/studio` for collaboration
- **Deployments**: .darkwave.app URLs with custom domain support

---

## Governance & Maintenance (INTERNAL DEV DOCS)

> **USER-FACING MESSAGING**: Use terms like "governance-supervised", "continuously maintained", 
> "security-first operations". NEVER use "upgradeable", "mutable", "can be changed" in user materials.
> The on-chain token name is neutral: "Wrapped DarkWave Coin" / "wDWC"

### Contract Architecture (Developer Reference Only)

**Ethereum (wDWC.sol)** - UUPS Proxy Pattern
- Contract address stays constant forever - users never need to update wallets
- Internal improvements can be applied without affecting balances
- Protected by owner (transfer to multi-sig for production)
- `VERSION` constant tracks versions internally
- Deploy: `npm run deploy:sepolia` | Maintain: `npm run upgrade:sepolia`

**Solana (wdwc-bridge)** - BPF Loader
- Program ID stays constant
- All state accounts preserved during maintenance
- `upgrade_authority` field controls governance
- `protocol_version` embedded in all transactions
- `is_paused` for emergency protection
- Deploy: `anchor deploy` | Maintain: `anchor upgrade`

### Governance Process (DSCIP)

Improvements follow the **DSC Improvement Proposal** process:
1. **Propose** - Document changes in DSCIP format
2. **Testnet** - Deploy to testnet, community testing
3. **Canary** - Limited mainnet deployment (opt-in validators)
4. **Mainnet** - Full activation at specified block height
5. **Rollback Plan** - Documented revert procedure

### Security Controls

| Control | Ethereum | Solana |
|---------|----------|--------|
| Governance Authority | Contract Owner | Program Authority |
| Emergency Stop | `pause()` / `unpause()` | `set_paused()` |
| Multi-sig Ready | Transfer ownership | Transfer authority |
| Version Tracking | `VERSION` constant | `protocol_version` field |
| Timelock | Add via governance | Add via governance |

---

## External Dependencies

- **Database**: PostgreSQL via DATABASE_URL
- **Auth**: Replit Auth + WebAuthn
- **Payments**: Stripe, Coinbase Commerce
- **Hub API**: https://orbitstaffing.io (HMAC-SHA256)

---

## Changelog

### December 2024
- **Governance-ready smart contracts** - Future-proof architecture for Ethereum and Solana
- **Protocol versioning** - All transactions embed version for compatibility tracking
- **DSC/DWC rebrand complete** - Contracts, docs, and UI updated
- Voice-enabled AI assistant with human-like speech (OpenAI TTS)
- AI credit system for future Studio AI features
- Studio: Live Preview, Database Explorer, CI/CD Pipelines
- Studio: 5 new templates (Vue, Next.js, Django, Go, Rust)
- Bridge page mobile responsiveness fixed (snap-scroll carousel, accordions)
- Added 5 "Coming Soon" chains (Polygon, Arbitrum, Optimism, Base, Avalanche)
- Staking security hardened (isAuthenticated middleware)
- Consolidated all roadmaps into single master list
