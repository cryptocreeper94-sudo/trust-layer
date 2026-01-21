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

**⚠️ PRE-BUILD CHECKLIST - VERIFY BEFORE WRITING ANY PAGE CODE ⚠️**

Every new page MUST pass ALL items before development begins:

#### 1. LAYOUT - True Bento Grid (3-Column)
- [ ] Desktop: 3-column grid with `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- [ ] Cards span appropriately: `col-span-1`, `col-span-2`, or `lg:col-span-3` for full-width
- [ ] Gap spacing: `gap-4` minimum, `gap-6` preferred
- [ ] Container: `container mx-auto px-4 sm:px-6 lg:px-8`

#### 2. GLASSMORPHISM - Every Card
- [ ] Use `<GlassCard glow>` component - NEVER plain divs for content sections
- [ ] Background: `bg-slate-900/50` or `bg-white/5` with `backdrop-blur-xl`
- [ ] Border: `border border-white/10` minimum
- [ ] Padding: `p-4 sm:p-6` - NOTHING touching edges

#### 3. GLOW & 3D EFFECTS
- [ ] Cards have `glow` prop enabled on GlassCard
- [ ] Hover states: `hover:border-cyan-500/30` transitions
- [ ] Shadow depth: `shadow-2xl` or `shadow-[0_0_30px_rgba(0,255,255,0.1)]`
- [ ] Framer Motion: `whileHover={{ scale: 1.02, y: -2 }}` on interactive cards

#### 4. SPACING & PADDING (CRITICAL)
- [ ] Page padding: `pt-20 pb-12` minimum (account for nav)
- [ ] Section margins: `mb-8` between major sections
- [ ] Card padding: `p-4` minimum, `p-6` preferred
- [ ] Text never touches card edges - always has internal padding
- [ ] Mobile: Extra care with `px-4` on all containers

#### 5. MOBILE-FIRST RESPONSIVE
- [ ] Base styles are mobile, then scale up (`md:`, `lg:`, `xl:`)
- [ ] Touch targets: 44px minimum (buttons, links)
- [ ] Font sizes: `text-sm` base, scale with `md:text-base lg:text-lg`
- [ ] Horizontal scroll content wrapped in carousels, NOT overflow-x-auto

#### 6. CAROUSELS & ACCORDIONS
- [ ] Long horizontal content: Use Swiper or custom carousel, NOT scroll
- [ ] FAQ/expandable: Use Accordion component
- [ ] Navigation items: Collapsible drawer on mobile

#### 7. ANIMATIONS & POLISH
- [ ] Page entrance: `motion.div` with `initial={{ opacity: 0, y: 20 }}`
- [ ] Staggered children: `transition={{ delay: 0.1 * index }}`
- [ ] Premium badges with glow: `bg-cyan-500/20 text-cyan-400 border-cyan-500/30`
- [ ] Gradient text for headlines: `bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent`

#### 8. COLOR PALETTE (DARK THEME ONLY)
- Background: `bg-slate-950`, `bg-slate-900`
- Primary: Cyan `cyan-400`, `cyan-500`
- Secondary: Purple `purple-400`, `purple-500`
- Accent: Pink `pink-400`, `pink-500`
- Text: `text-white`, `text-white/70`, `text-white/50`
- Success: `emerald-400` | Warning: `amber-400` | Error: `red-400`

**Component Requirements:**
- `GlassCard` with `glow` prop = REQUIRED
- `Badge` for status/labels = REQUIRED
- `Button` from UI library = REQUIRED (no custom buttons)
- `motion.div` wrapper = REQUIRED for sections
- `data-testid` on all interactive elements = REQUIRED

### Technical Implementations
- **Blockchain**: BFT-PoA consensus, stake-weighted validator selection, PostgreSQL state, SHA-256/Merkle trees, 400ms block time, 200K+ TPS. Includes validator staking, slashing, epoch-based finality, and node sync APIs. Native asset: Signal (SIG) - NOT a "cryptocurrency" but a transmission of verified intent. Avoid "currency" framing entirely - Signal is acknowledgement, access, and proof of participation in the trust network. The value is the infrastructure it unlocks, not speculation. "Crypto-currency" language alienates spiritual/traditional people and attracts speculators - neither is the target. Signal = Trust Network Access Token.
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

## LOCKED-IN REWARD STRUCTURE (DO NOT CHANGE WITHOUT OWNER APPROVAL)

This is the official, finalized reward structure for the 90-day presale campaign. These values are permanent commitments to the community.

### Shell Value (PERMANENT)
- **1 Shell = $0.001** (one-tenth of a cent)
- 1,000 Shells = $1
- 10,000 Shells = $10
- 100,000 Shells = $100
- 1,000,000 Shells = $1,000
- At TGE: 100 Shells = 1 SIG (when SIG = $0.01)

### RACE TO 200 - Zealy Mission Campaign (ACTIVE NOW)

**How It Works:**
- This is a PRODUCTION race, not a signup race
- First 200 participants who complete missions are eligible
- 2 missions available daily via Zealy
- Shells auto-deposited to DarkWave wallet when missions verified
- Rankings based on TOTAL MISSIONS COMPLETED, not signup order
- Race ends when we hit 200 participants OR April 8 (presale end)

**Daily Rewards:**
- ~$2.50 worth of Shells per mission
- ~$5/day potential (if both daily missions completed)
- Must have DarkWave wallet connected to receive rewards

**Race End Bonuses (Based on Final Ranking):**

| Rank | Badge | Bonus | Shell Value |
|------|-------|-------|-------------|
| **Top 10** | Founders Badge | 2.0× multiplier | $750–$1,500 |
| **11-50** | Core Badge | 1.5× multiplier | $150–$500 |
| **51-200** | Participant Badge | 1.0× (base rewards) | $25–$100 |

**Founders Badge Perks:**
- Lifetime VIP status
- 2× governance weight
- Guaranteed whitelist
- Premium presale allocation

### Automatic Shells Airdrop (ACTIVE)
- **Schedule**: Twice daily at 1 AM and 1 PM CST (7 AM and 7 PM UTC)
- **Amount**: 25 shells per eligible user per airdrop (50 shells/day max)
- **Eligibility**: Anyone with an active shells wallet who's been active in last 7 days
- **Fully automatic** - no manual intervention needed

### Founders Circle Presale Bonuses (First 100 Buyers)
- $25 purchase = 25% bonus
- $50 purchase = 50% bonus
- $75 purchase = 75% bonus
- $100 purchase = 100% bonus (cap to prevent whales)

## Next Session Priorities
1. **Veil ebook download cards** - Fix padding on `/veil` landing page (text pushed against edges)
2. **Ebook expansion** - Research more details to lengthen chapters, add historical context and background explanations

## External Dependencies
- **Database**: PostgreSQL
- **Authentication**: Firebase Auth
- **Payments**: Stripe, Coinbase Commerce
- **Hub API**: https://orbitstaffing.io
- **AI**: OpenAI GPT-4o (via Replit AI Integrations)
- **Social**: Twitter/X, Discord, Telegram, Facebook automation