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

## Chronicles Personality AI System

The Personality AI is a proprietary system that powers the "Parallel Self" experience in DarkWave Chronicles. It learns from player choices, beliefs, and emotional responses to become a personalized representation of the player in the fantasy world.

### Core Philosophy
- **Player IS the Hero**: Not just controlling a character - the AI becomes them
- **Many Lenses Design**: Reality itself shifts based on player beliefs
- **Every Choice Matters**: Decisions shape how the world perceives and reacts
- **Awakening Tool**: Deeper purpose as a questioning/awakening tool disguised as entertainment

### 5-Axis Emotion System
Each axis ranges from -100 (negative) to +100 (positive):
1. **Courage ↔ Fear**: How the player faces danger and uncertainty
2. **Hope ↔ Despair**: Outlook on the future and possibilities
3. **Trust ↔ Suspicion**: Relationship with NPCs and institutions
4. **Passion ↔ Apathy**: Emotional investment in causes and people
5. **Wisdom ↔ Recklessness**: Decision-making approach and risk tolerance

### Core Philosophy - NO LABELS, NO BOXES
CRITICAL: This system does NOT judge morality or categorize players.
- **NO moral alignment** (good/evil) - we only observe choice PATTERNS
- **NO archetypes** - you are not a "Guardian" or "Rebel" - you are YOU
- **NO predetermined categories** - your identity EMERGES through choices
- **Free will only** - we observe HOW you choose, not WHETHER choices are "right"

### What We DO Observe (Without Judgment)
- **Worldview**: optimist / realist / pessimist (how you see the world)
- **Choice Signatures**: Fluid observations of your emerging patterns
  - "You've shown willingness to face uncertainty"
  - "Your choices reveal an affinity for connection"
- **Values (Emergent)**: Observed through choices, not pre-selected
- **Visual Presentation**: masculine / feminine / neutral (TODO: UI implementation)

### Choice Echo Templates
Instead of labels, AI generates fluid reflections:
- Courage: "You face uncertainty head-on" / "You weigh risks carefully"
- Hope: "Openness to possibility" / "Pragmatic awareness"  
- Trust: "You extend trust readily" / "You maintain careful boundaries"
- Passion: "Strong conviction drives you" / "Measured detachment guides you"
- Wisdom: "You pause to consider" / "You favor decisive action"

### Key Files
- `shared/schema.ts`: Database schemas (playerPersonalities, playerChoices, chroniclesConversations)
- `server/chronicles-ai.ts`: Main AI engine with scenario generation, choice processing, and chat
- `server/routes.ts`: API endpoints under `/api/chronicles/*`
- `client/src/pages/chronicles-ai-demo.tsx`: Interactive demo page

### API Endpoints
- `GET /api/chronicles/personality`: Get/create player personality profile
- `POST /api/chronicles/personality`: Update personality settings
- `POST /api/chronicles/scenario`: Generate scenario based on personality
- `POST /api/chronicles/choice`: Process player choice and evolve personality
- `POST /api/chronicles/chat`: Chat with parallel self
- `GET /api/chronicles/summary`: Generate AI personality summary
- `GET /api/chronicles/values`: Get observed values and visual presentations

### Demo Page
Access at `/chronicles/ai` - requires authentication to create personalized profile.

### Build Your Legacy Page
Access at `/legacy` - pre-launch feature for recording voice samples, viewing personality summary, and managing credits.

---

## Credits System

### Credit Costs
- **AI Chat Message**: 10 credits
- **Scenario Generation**: 20 credits
- **Choice Processing**: 5 credits
- **Voice Clone Creation**: 500 credits
- **Voice TTS (per 100 chars)**: 5 credits
- **Personality Summary**: 30 credits

### Credit Packages
- **Starter**: $10 (1,000 credits)
- **Builder**: $25 (3,000 + 500 bonus credits)
- **Architect**: $50 (7,000 + 1,500 bonus credits)
- **Founder**: $100 (15,000 + 5,000 bonus credits)

### API Endpoints
- `GET /api/credits/balance`: Get user credit balance
- `GET /api/credits/packages`: List available packages
- `GET /api/credits/transactions`: Get transaction history
- `POST /api/credits/purchase`: Create Stripe checkout

### Key Files
- `server/credits-service.ts`: Credits management
- `server/voice-service.ts`: Voice sample handling

---

## Voice Cloning Technology

Industry-first feature where players' parallel selves speak with their actual voice, accent, and inflections.

### How It Works
1. **Record Voice Samples**: Users provide short recordings reading curated phrases
2. **AI Voice Clone**: Advanced synthesis creates a digital replica of their unique vocal signature
3. **Speak Across Eras**: Parallel self speaks in the user's voice across 70+ mission theaters

### API Endpoints
- `GET /api/voice/status`: Get voice sample status and count
- `GET /api/voice/prompt`: Get random recording prompt
- `POST /api/voice/sample`: Save recorded voice sample (base64 audio)
- `POST /api/voice/clone`: Initiate voice clone creation

### Technical Notes
- Uses Web Audio API for browser recording
- Placeholder for ElevenLabs/Resemble API integration
- 500 credits per voice clone creation

---

## Early Adopter Rewards

Participants who join before public beta (July 4, 2026) receive:

### Rewards
- **500 DWC**: Bonus coins for early signup
- **Pioneer Title**: Exclusive in-game recognition
- **Era Access**: First to explore new mission theaters

### How To Qualify
- Create account on Build Your Legacy page (`/legacy`)
- Record at least one voice sample
- Complete at least one AI scenario

---

## Marketing Automation System

Proprietary auto-deployment system for social media marketing with 264 posts seeded across 4 platforms.

### Platforms
- Twitter/X (280 char limit)
- Facebook (~500 char optimal)
- Discord (2,000 char limit, webhook-based)
- Telegram (4,096 char limit, bot-based)

### Features
- 3-hour interval scheduling (8 posts/day)
- Category rotation (vision, tech, community, hype, news)
- Deploy logs and analytics
- Resellable as separate product component

### Admin Access
- **Owner Control Center**: `/admin`
- **Marketing Dashboard**: `/admin/marketing`
- **Footer Admin Link**: Available on every DWSC page

### Required Environment Variables
- `DISCORD_WEBHOOK_URL`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHANNEL_ID`
- `TWITTER_API_KEY`, `TWITTER_API_SECRET`, `TWITTER_ACCESS_TOKEN`, `TWITTER_ACCESS_TOKEN_SECRET`
- `FACEBOOK_PAGE_ID`, `FACEBOOK_ACCESS_TOKEN`

---

## Payment Infrastructure

### Crowdfund Donations
- Presets: $25, $50, $100, $500, $1000
- Dynamic Stripe Checkout (no dashboard setup needed)
- Auto-reward: Early Adopter status on completion

### Token Presale
- **Genesis Tier**: $1,000 (25% bonus, 156,250 DWC)
- **Founder Tier**: $500 (15% bonus, 71,875 DWC)
- **Pioneer Tier**: $250 (10% bonus, 34,375 DWC)
- **Early Bird Tier**: $100 (5% bonus, 13,125 DWC)

### Stripe Webhook
- Endpoint: `/api/stripe/webhook`
- Requires: `STRIPE_WEBHOOK_SECRET` environment variable
- Security: Signature verification, server-side token calculations

---

## External Dependencies

- **Database**: PostgreSQL
- **Authentication**: Replit Auth, WebAuthn
- **Payments**: Stripe, Coinbase Commerce
- **Hub API**: https://orbitstaffing.io (HMAC-SHA256 authenticated)
- **AI**: OpenAI (via Replit AI Integrations - no API key required)