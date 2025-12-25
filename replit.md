# DarkWave Smart Chain - Replit Agent Guide

## Overview

DarkWave Smart Chain (DSC) is a comprehensive blockchain ecosystem developed by DarkWave Studios, designed to surpass Solana and Ethereum in speed, stability, and features. It includes a Layer 1 Proof-of-Authority blockchain and the DarkWave Portal, a React web application serving as the ecosystem's interface, block explorer, and developer hub. The project also envisions "DarkWave Chronicles," a fantasy-themed game with a living political simulation and community-driven creation. The ecosystem is structured across three domains: dwsc.io (main blockchain portal), darkwavegames.io (gaming), and darkwavestudios.io (parent company site).

## User Preferences

- Preferred communication style: Simple, everyday language
- User wants: Full blockchain implementation, not just a web portal. No piggybacking on other chains.
- Design: Premium UI with extensive visual effects ("everything should sparkle and shine")
- Mobile: Mobile-first design with self-contained carousels, accordions, dropdowns
- Branding: White-labeled, no Replit branding, dark theme only

## Design Protocol (Project-Wide) - MANDATORY FOR ALL PAGES

**CRITICAL: Every new page MUST follow this design protocol. Reference this section before creating any UI.**

### ⚠️ ABSOLUTE RULE: Photorealistic Images on ALL Cards

**THIS IS NON-NEGOTIABLE. ZERO EXCEPTIONS.**

Every card, tile, panel, or container that displays subject matter MUST have a photorealistic background image that reflects the card's content. This applies to:

- ✅ Feature cards on any page
- ✅ Navigation menu cards (mobile and desktop)
- ✅ Carousel/slideshow items
- ✅ Accordion items when expanded
- ✅ Dashboard widgets and stat cards
- ✅ Category cards in grids
- ✅ NFT/product cards
- ✅ Any clickable card with a destination

**NEVER create:**
- ❌ Transparent/see-through cards with just icons
- ❌ Gradient-only backgrounds without imagery
- ❌ Plain colored cards
- ❌ Cards with just text and icons
- ❌ "Skeleton" or placeholder cards in production

**Implementation Pattern:**
```jsx
<div className="relative overflow-hidden rounded-xl">
  {/* 1. Background Image (required) */}
  <img src={subjectMatterImage} className="absolute inset-0 w-full h-full object-cover" />
  {/* 2. Gradient Overlay (required for text readability) */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
  {/* 3. Content (z-indexed above) */}
  <div className="relative z-10">...</div>
</div>
```

### Card & Layout Requirements
- **Bento grid layouts**: Varied card sizes (1x1, 2x1, 2x2, etc.) in responsive grid
- **Photorealistic backgrounds**: Every card must have a photorealistic image from `attached_assets/generated_images/`
- **No plain cards**: Never create cards without background imagery
- **Trading card / NFT aesthetic**: Holographic borders, rainbow refractor effects, glow overlays

### Visual Effects (Required)
- **Glassmorphism**: `backdrop-blur-xl`, semi-transparent backgrounds (`bg-black/60`)
- **Holographic borders**: Gradient borders with glow (`box-shadow: 0 0 40px rgba(color)`)
- **Gradient overlays**: Always overlay images with gradients for text readability
- **Subtle animations**: Framer Motion for hover effects, entrance animations
- **Shimmer effects**: Diagonal light sweep on premium elements

### Interactive Components
- **Accordion dropdowns**: Expandable sections for detailed content
- **Carousels**: Self-contained horizontal scrolling for mobile
- **Hover states**: Scale transforms, glow intensification
- **data-testid**: Required on ALL interactive elements

### Available Background Images
```
attached_assets/generated_images/
├── futuristic_blockchain_network_activity_monitor.png (blockchain/tech)
├── futuristic_dashboard_interface_for_managing_decentralized_applications.png (dashboards)
├── fantasy_sci-fi_world_landscape.png (gaming/fantasy)
├── deep_space_station.png (space/cosmos)
├── cyberpunk_neon_city.png (urban/tech)
├── medieval_fantasy_kingdom.png (fantasy/governance)
├── quantum_dimension_realm.png (abstract/premium)
└── darkwave_token_transparent.png (logo/branding)
```

### Color Palette
- Primary: Cyan (`#06B6D4`), Purple (`#A855F7`), Pink (`#EC4899`)
- Gradients: `from-cyan-500 via-purple-500 to-pink-500`
- Backgrounds: Dark grays (`gray-900`, `gray-950`, `black`)
- Text: White for headings, `gray-400` for body, color accents for highlights

### Character Assets
Characters stored in `attached_assets/generated_images/` with naming convention:
- `{role}_{descriptor}_portrait.png` (e.g., `tribal_emissary_woman_portrait.png`)
- Characters can be reused as AI guides throughout the ecosystem
- Character metadata (name, role, beliefs, emotions) stored in database for recall

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

**Core Philosophy**: No external moral judgment. Only internal belief systems, free will, and consequences.

### The Sentient Mirror Concept
The character isn't an avatar you control—it's an extension of your own psyche in a fantasy world. Their emotions mirror your emotions. Their struggles reflect your inner landscape. This is self-discovery through interactive narrative.

### Spiritual/Belief System Layer
Players choose a belief framework that shapes their character's conscience and emotional responses:
- **Real-world faiths**: Buddhism, Hinduism, Christianity, Islam, Judaism, indigenous spiritual traditions
- **Philosophical stances**: Atheism, agnosticism, nihilism, stoicism, humanism
- **Fantasy equivalents**: In-world deity representations that parallel real beliefs

The belief system affects:
- How the character emotionally processes choices
- What causes inner turmoil vs. peace
- Relationship dynamics with characters of different beliefs
- The character's interpretation of "right" and "wrong" (internal, not game-imposed)

**Key Distinction**: The game never labels actions as good/evil. The character's chosen belief system creates their OWN moral framework, and consequences flow from that.

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