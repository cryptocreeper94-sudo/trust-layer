# DarkWave Smart Chain - Replit Agent Guide

## Overview

DarkWave Smart Chain (DSC) is a comprehensive blockchain ecosystem developed by DarkWave Studios, designed to surpass Solana and Ethereum in speed, stability, and features. It includes a Layer 1 Proof-of-Authority blockchain and the DarkWave Portal, a React web application serving as the ecosystem's interface, block explorer, and developer hub. The project also envisions "DarkWave Chronicles," a fantasy-themed game with a living political simulation and community-driven creation. The ecosystem is structured across four domains: dwsc.io (main blockchain portal), darkwavegames.io (gaming), darkwavestudios.io (parent company site), and yourlegacy.io (Chronicles standalone).

## User Preferences

- Preferred communication style: Simple, everyday language
- User wants: Full blockchain implementation, not just a web portal. No piggybacking on other chains.
- Design: Premium UI with extensive visual effects ("everything should sparkle and shine")
- Mobile: Mobile-first design with self-contained carousels, accordions, dropdowns
- Branding: White-labeled, no Replit branding, dark theme only

## Design Protocol (Project-Wide) - MANDATORY FOR ALL PAGES

**CRITICAL: Every new page MUST follow this design protocol. Reference this section BEFORE writing any UI code.**

---

### 🚨 PRE-BUILD CHECKLIST (MANDATORY BEFORE ANY PAGE WORK)

**STOP! Before creating or modifying ANY page, complete this checklist:**

#### Step 1: Asset Selection
- [ ] Identify the page's subject matter and purpose
- [ ] Select appropriate photorealistic images from `attached_assets/generated_images/`
- [ ] Ensure EVERY card, tile, and panel has a matching background image
- [ ] If no suitable image exists, generate one BEFORE building the page

#### Step 2: Layout Planning
- [ ] Design bento grid layout with varied card sizes (1x1, 2x1, 2x2, etc.)
- [ ] Plan mobile-first responsive breakpoints
- [ ] Identify which sections need carousels/accordions on mobile
- [ ] Map out hero section with photorealistic background

#### Step 3: Interactive Elements
- [ ] Plan hover effects for all clickable elements (scale, glow, 3D transforms)
- [ ] Add Framer Motion entrance animations
- [ ] Include info tooltips (?) for technical terms
- [ ] Add description modals for complex features

#### Step 4: Visual Effects
- [ ] Apply glassmorphism (backdrop-blur, semi-transparent backgrounds)
- [ ] Add holographic borders with glow effects
- [ ] Include gradient overlays on all images for text readability
- [ ] Add shimmer effects on premium/CTA elements

#### Step 5: Mobile Requirements
- [ ] Touch targets ≥48px
- [ ] Self-contained horizontal carousels (no scroll overflow)
- [ ] Accordions for dense content sections
- [ ] Test at 375px viewport width

#### Step 6: Component Standards
- [ ] Use `data-testid` on ALL interactive elements
- [ ] Follow naming convention: `{action}-{target}` or `{type}-{content}-{id}`
- [ ] Ensure consistent spacing and typography scale

---

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
├── darkwave_token_transparent.png (logo/branding)
├── ancient_egyptian_kingdom_sunset.png (Egyptian era)
├── wild_west_frontier_town.png (Wild West era)
├── victorian_london_street_scene.png (Victorian era)
├── ancient_greek_athens_parthenon.png (Greek era)
├── viking_longship_fjord_scene.png (Viking era)
├── renaissance_florence_italy_scene.png (Renaissance era)
├── roman_empire_colosseum_gladiators.png (Roman era)
├── feudal_japan_samurai_castle.png (Japanese era)
├── stone_age_village_scene.png (Prehistoric era)
└── industrial_steampunk_city.png (Industrial era)
```

### Available Video Assets
```
attached_assets/generated_videos/
├── fantasy_world_cinematic_flyover.mp4 (hero background, 8s)
└── medieval_kingdom_establishing_shot.mp4 (medieval scenes, 6s)
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
- **Multi-PWA**: Host-based routing serves distinct PWA manifests, themes, and installable experiences for `dwsc.io`, `darkwavegames.io`, `darkwavestudios.io`, and `yourlegacy.io` from a shared backend.

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

## DarkWave Chronicles - The Flagship Product

**Tagline**: "Not A Game. A Life." / "Live Your Legacy."
**Universe**: The ChronoVerse - 70+ historical eras as parallel timelines with echoes
**Domain**: yourlegacy.io

**Full Vision Document**: See `CHRONICLES_VISION.md` for complete details.

### What It Is
A real-time, persistent life simulator set in a fantasy world where YOU are the character - not a fictional persona, but your actual self. Your personality, emotions, beliefs, faith, values. First-person. 24/7. The world moves whether you're there or not.

### Core Differentiators
1. **Real-Time Persistent World**: 24-hour days. World continues when you're away. You miss events. Just like real life.
2. **YOU Are The Character**: Not role-playing. YOUR actual personality, beliefs, emotions, deity. You step into this realm as yourself.
3. **No Good/Evil**: No alignment system. Everything is perspective-based. Actions have consequences through relationships, not game-imposed morality.
4. **Social/Political/Psychological Experiment**: Simulation of human society to help you understand real life.
5. **Ongoing Legacy**: No winning. No end state. Build your legacy over time.

### Era System & Time Travel
- Choose starting era (Cro-Magnon to Medieval to beyond)
- Progress naturally through time
- Time travel events transport you to other eras
- Complete activities to return to home timeline
- Side missions and adventures within the persistent framework

### Community-Driven Development
- Developers submit ideas, team determines feasibility
- Approved ideas become real content
- Creators OWN their creations like real estate
- Properties can be traded or LOST
- World built BY the community FOR the community

### AI Engine Requirements
- Dynamic emotional/psychological model for every entity
- Unique emotion sets (some emotional, some rational, some chaotic)
- Belief systems shaping behavior
- Full spectrum of human psychology through AI
- Consequence webs rippling through society

### The Goal
Help players understand how to navigate REAL life by living a parallel one in fantasy. Not escapism - exploration of self and society.

### Technical Architecture (Planned)

**AI Stack (3-Tier)**:
1. Deterministic Planners - Day-to-day decisions (fast, cheap)
2. LLM Microservices - Dialogue, reactions, complex decisions (OpenAI)
3. Offline LLM Batches - Major historical events, world-shaping moments

**Emotion System (5-Axis Model)**:
| Axis | Range | Affects |
|------|-------|---------|
| Arousal | Calm ↔ Agitated | Reaction speed, impulsiveness |
| Valence | Sad ↔ Happy | Cooperation, risk-taking |
| Social Cohesion | Isolated ↔ Bonded | Loyalty, betrayal threshold |
| Fear | Secure ↔ Terrified | Fight/flight decisions |
| Ambition | Content ↔ Driven | Power-seeking behavior |

**Belief System Layer**: Real-world faiths, philosophical stances, fantasy deities - all shaping character conscience and emotional responses.

### MVP Roadmap
- **Phase 0** (3-4 mo): Single-era sandbox, 200 agents, emotion dashboard
- **Phase 1** (6-8 mo): Faction councils, treaties, player crises
- **Phase 2** (12+ mo): Multi-era, time-travel echoes, full scale

### Current Reality
- One developer with a laptop
- Crowdfunding infrastructure ready
- Building excitement and community
- Need: Servers, hosting, developer contributions as project scales