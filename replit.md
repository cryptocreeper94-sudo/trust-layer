# DarkWave Smart Chain - Replit Agent Guide

## Overview

DarkWave Smart Chain (DSC) is a blockchain ecosystem by DarkWave Studios, aiming to surpass Solana and Ethereum in speed, stability, and features. It comprises a Layer 1 Proof-of-Authority blockchain and the DarkWave Portal, a React web application for ecosystem interface, block explorer, and developer hub. The project also includes "DarkWave Chronicles," a fantasy-themed game with a living political simulation and community-driven creation. The ecosystem is structured across four domains: dwsc.io (main blockchain portal), darkwavegames.io (gaming), darkwavestudios.io (parent company site), and yourlegacy.io (Chronicles standalone).

## User Preferences

- Preferred communication style: Simple, everyday language
- User wants: Full blockchain implementation, not just a web portal. No piggybacking on other chains.
- Design: Premium UI with extensive visual effects ("everything should sparkle and shine")
- Mobile: Mobile-first design with self-contained carousels, accordions, dropdowns
- Branding: White-labeled, no Replit branding, dark theme only

## System Architecture

### UI/UX Decisions
- **Design Protocol**: Mandatory for all new pages. Includes asset selection (photorealistic images from `attached_assets/generated_images/` for every card/tile/panel), bento grid layouts with varied card sizes, mobile-first responsive breakpoints, and hero sections with photorealistic backgrounds.
- **Interactive Elements**: Hover effects (scale, glow, 3D transforms), Framer Motion entrance animations, info tooltips, and description modals.
- **Visual Effects**: Glassmorphism (backdrop-blur, semi-transparent backgrounds), holographic borders with glow effects, gradient overlays on images for text readability, and shimmer effects on premium/CTA elements.
- **Mobile Requirements**: Touch targets ≥48px, self-contained horizontal carousels, accordions for dense content, and testing at 375px viewport width.
- **Component Standards**: `data-testid` on all interactive elements, consistent spacing, and typography scale.
- **Color Palette**: Primary Cyan, Purple, Pink; gradients `from-cyan-500 via-purple-500 to-pink-500`; dark gray/black backgrounds; white/gray text.

### Technical Implementations
- **Blockchain**: Proof-of-Authority (PoA) with Founders Validator, PostgreSQL for storage, SHA-256/Merkle trees/HMAC-SHA256 cryptography, 400ms block time, 200K+ TPS. Native token DWC (100M supply, 18 decimals, no burn).
- **Web Portal**:
    - **Frontend**: React 18, TypeScript, Vite, Wouter, TanStack Query, Tailwind CSS v4, Framer Motion.
    - **Backend**: Node.js, Express.js, TypeScript, Drizzle ORM, PostgreSQL.
    - **Authentication**: Replit Auth (OAuth 2.0), WebAuthn/Passkeys.
    - **Payments**: Stripe, Coinbase Commerce.
    - **Multi-PWA**: Host-based routing for `dwsc.io`, `darkwavegames.io`, `darkwavestudios.io`, and `yourlegacy.io`.
- **DarkWave Studio (IDE)**: Monaco editor, file tree, multi-file tabs, Git integration, simulated terminal, deployment UI, package manager, environment variables, project templates, search/replace, keyboard shortcuts, real-time collaboration, Live Preview, Database Explorer, CI/CD, AI Assistant.
- **DeFi Features**: Testnet Faucet, DEX/Token Swap (AMM-style), NFT Marketplace, Portfolio Dashboard, Transaction History, Token Launchpad, Liquidity Pools, NFT Gallery, NFT Creator Tool, Price Charts (Recharts), Webhook/Events API, Liquid Staking (stDWC).
- **Cross-Chain Bridge**: Lock & mint (DWC ↔ wDWC) for Ethereum Sepolia & Solana Devnet. Includes wDWC ERC-20 contract and Solana bridge program.
- **Contract Architecture**: UUPS Proxy for Ethereum (wDWC.sol), BPF Loader for Solana (wdwc-bridge). Governance via DSC Improvement Proposal (DSCIP) with Testnet, Canary, Mainnet stages.
- **DarkWave Chronicles (Flagship Product)**:
    - **Core Concept**: Epic adventure across 70+ historical eras where YOU are the hero - not an avatar, your actual parallel self. Mission-driven gameplay with campaigns, factions, and legend-building.
    - **Messaging Guidelines**: 
      - AVOID: "life simulator," "simulate," "manage," "responsibilities," "second life," "persistent chores"
      - EMBRACE: "missions," "campaigns," "story arcs," "parallel self," "legend," "adventures," "chronicle wins," "factions," "alliances"
    - **Taglines**: "YOU. The Legend." / "Live Your Legacy" / "Not an avatar. YOU."
    - **Four Pillars**: (1) Player-as-Prime Hero, (2) Living Worlds of Discovery, (3) Impactful Choices & Alliances, (4) Power Progression Without Grind
    - **Era System**: 70+ Mission Theaters across all of human history, each with unique campaigns, factions, and rewards.
    - **Community-Driven Development**: User-submitted ideas, creator ownership of in-game properties with blockchain verification.
    - **Storefront Sponsorship**: Real businesses sponsor in-game locations, with revenue from licensing fees, click royalties, and conversion bonuses.
    - **AI Engine (Planned)**: 3-tier stack (Deterministic Planners, LLM Microservices, Offline LLM Batches), 5-Axis Emotion System, Belief System Layer.

## External Dependencies

- **Database**: PostgreSQL (via DATABASE_URL)
- **Authentication**: Replit Auth, WebAuthn
- **Payments**: Stripe, Coinbase Commerce
- **Hub API**: https://orbitstaffing.io (HMAC-SHA256 authenticated)
- **AI**: OpenAI (for TTS and AI code assistant)

## Chronicles Development Roadmap

### Phase 0 (Q1-Q2 2025) - Foundation
- Website & branding launch ✓
- Crowdfunding infrastructure ✓
- Discord setup & community launch
- Telegram re-engagement & DarkWave Pulse mini-app
- Social media presence (Twitter/X)
- Core database schema design
- Basic AI agent framework
- Single-era sandbox (Medieval)

### Phase 1 (Q3-Q4 2025) - Economy & Property
- Property registry (blockchain-backed)
- Storefront sponsorship system design
- Business partner portal
- Location-based pricing engine
- Traffic analytics & conversion tracking
- Creator licensing & royalty system

### Phase 2 (Q1-Q2 2026) - Multi-Era Launch
- 10 historical eras live
- Storefront marketplace launch
- Era-specific sponsor integration
- Cross-era quest framework
- Public alpha release
- Mobile app (Android/iOS)

### Phase 3 (Q3-Q4 2026) - Full ChronoVerse
- Full 70+ era deployment
- City district auctions (premium locations)
- Advanced sponsor analytics dashboard
- Community content creation tools
- Public beta release (July 4, 2026 target)
- DWC mainnet integration

### Phase 4+ (2027+) - Future Vision
- **VR/AR Integration**: Chronicles' "parallel self" concept is perfectly suited for immersive VR - you're not playing a character, you're stepping through a portal. Same you, different era. Potential partnership with VR studios rather than building from scratch. Hardware costs declining (Quest 3, Vision Pro pushing mainstream adoption).
- **Cross-Platform Expansion**: Console ports, streaming platforms
- **Chronicles Universe Expansion**: Spin-off experiences, merchandise, media adaptations

## Cross-Platform Strategy

**Target Platforms** (in order of priority):
1. **Web** (Phase 0-2): Desktop browsers, responsive for tablets/mobile - lowest barrier to entry
2. **Mobile Native** (Phase 2): iOS/Android apps for optimized touch experience
3. **Desktop Native** (Phase 3): Windows/Mac apps for enhanced performance
4. **Smart TV/Console** (Phase 4): Living room experience, controller support
5. **VR/AR** (Phase 4+): Immersive experience via partnerships

**Architecture Considerations**:
- Design core game logic as platform-agnostic from day one
- Use shared backend/API layer across all clients
- Progressive enhancement: same experience scales up/down based on device capabilities
- Cloud save sync across all platforms - start on phone, continue on desktop, experience in VR
- Input abstraction layer: touch, mouse/keyboard, controller, VR controllers all map to same actions
- UI/UX adapts to form factor (compact mobile UI vs. expansive desktop vs. immersive VR)

**Timing**: Address architecture decisions in Phase 0-1 to avoid costly rewrites later. Actual multi-platform shipping can be phased.

## Core Experience Metaphor
The "portal" concept: Like putting on a mask or VR goggles - you step through and wake up as yourself in another era. Laying in bed staring at the ceiling? Now you're in a 1920s speakeasy. Same you, different world. This is what separates Chronicles from every other game - no character creation screen, no avatar customization. YOU are already the character.

## Chronicles Philosophy: "The Veil Is Dropping"

**Core Purpose**: Chronicles isn't just entertainment - it's a tool for awakening. The deeper mission is to help players question what they've been told about reality, history, and the nature of existence. Not through preaching or forcing conclusions, but by creating a space where organic exploration naturally leads to questioning.

**The Many Lenses Design**:
1. **Bedrock Layer** (Shared by all players): Mechanics work. Physics function. NPCs exist. Economy runs. Historical events provide structure. This is the foundation everyone agrees on.

2. **Lens Layer** (Reality adapts to belief): Different players can experience fundamentally different cosmologies. One sails to the edge and finds the firmament - the dome, the ice walls, the boundary. Another circumnavigates a sphere. Neither is "wrong." Both are true in their experience. The world doesn't tell you what reality IS - it reflects back your journey of discovery.

3. **Belief Detection** (No surveys, no A/B choices): The AI watches organic behavior - what questions you ask NPCs, what books you read, what expeditions you pursue, whether you trust "official" narratives or seek alternative sources. Over time, it infers your worldview and seamlessly adapts what you experience.

4. **Invisible Branching**: No "Choose Path A or B" moments. Instead, content weaves differently based on accumulated signals. The skybox subtly shifts. Maps reveal different truths. NPCs share different knowledge. It feels like discovery, not selection.

**What Makes It Unprecedented**: Every other game picks one reality and enforces it. Chronicles is the first to treat cosmology itself as a discovery - not a given. Players don't consume a pre-built narrative about what's real. They explore, question, and come to their own understanding.

**The Deeper Mission**: Help expose the constructs - the "man behind the curtain" protected truths that are starting to unravel. Not through propaganda, but through a subconscious tool that naturally invites questioning. Fun and engaging first, but with awakening woven into the fabric. Whether players land on mainstream beliefs or alternative truths, they've engaged in the act of questioning - and that's the victory.

## Marketing & Community Strategy

- **Discord**: Server with channels for announcements, dev updates, community chat, creator collaboration
- **Telegram**: Re-engage existing community, deploy DarkWave Pulse mini-app for ecosystem updates
- **Twitter/X**: Regular development updates, teasers, community engagement
- **Business Outreach**: Partner pre-registration, storefront sponsorship marketing to brands