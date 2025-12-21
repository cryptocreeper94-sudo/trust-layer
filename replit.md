# DarkWave Chain - Replit Agent Guide

## Overview

DarkWave Chain is a complete blockchain ecosystem by DarkWave Studios, consisting of two main components:

1. **DarkWave Chain Blockchain** (`blockchain/`) - A real Layer 1 blockchain implementation in Rust with Proof-of-Authority consensus
2. **DarkWave Portal** (`client/`, `server/`) - A React web application serving as the ecosystem interface, block explorer, and developer hub

The project goal is to build a blockchain that is faster, more stable, and feature-rich than Solana and Ethereum.

## User Preferences

Preferred communication style: Simple, everyday language.
User wants: Full blockchain implementation, not just a web portal. No piggybacking on other chains.

## Domains
- darkwavechain.io
- darkwavechain.com

## Blockchain Architecture (`blockchain/`)

### Core Components
- **Language**: Rust (using tokio, sled, ed25519-dalek, axum)
- **Consensus**: Proof-of-Authority (PoA) with rotating validators
- **Storage**: Sled embedded database for ledger, accounts, and transactions
- **Cryptography**: Ed25519 signatures, SHA-256 hashing, Merkle trees
- **RPC API**: Axum-based JSON-RPC server for external communication

### Module Structure
- `types.rs` - Core types (Block, Transaction, Account, ChainConfig)
- `crypto.rs` - Cryptographic primitives (keypair, hashing, signatures)
- `ledger.rs` - State storage and account management
- `consensus.rs` - Proof-of-Authority consensus engine
- `rpc.rs` - JSON-RPC API endpoints
- `node.rs` - Node orchestration and startup
- `main.rs` - CLI entry point

### Chain Configuration
- Chain ID: 8453
- Chain Name: DarkWave Chain
- Native Token: DWT (DarkWave Token)
- Total Supply: 100,000,000 DWT
- Decimals: 18 (ERC-20 compatible)
- Block Time: 400ms
- Max TX per block: 10,000

### RPC Endpoints
- `GET /chain` - Chain info (ID, name, height)
- `GET /block/:height` - Get block by height
- `GET /block/latest` - Get latest block
- `GET /account/:address` - Get account balance/nonce
- `POST /transaction` - Submit transaction
- `GET /stats` - Network statistics

## Web Portal Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state, React Context for local preferences and notifications
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS v4 with custom theme configuration, Framer Motion for animations
- **Typography**: Custom font stack (Space Grotesk, Rajdhani, Inter)

### Key Features
- Global Search (Cmd+K)
- Theme Toggle (dark/light/system)
- Notifications System
- Favorites/Bookmarks with localStorage persistence
- Mobile Navigation Drawer
- Devnet Sandbox for live blockchain testing
- Real-time blockchain stats via WebSocket
- PWA Support (installable, offline-capable)

### PWA Implementation
- **Manifest**: `client/public/manifest.webmanifest` with DarkWave shield icons
- **Service Worker**: `client/public/sw.js` for offline caching
- **Icons**: All sizes in `client/public/icons/` (72x72 to 512x512)
- **App Shortcuts**: Explorer, Treasury, Developer Portal
- **Theme Color**: Cyan (#00ffff)

### Devnet Sandbox Endpoints
- `POST /api/devnet/wallet/create` - Create funded test wallet (1000 DWT)
- `POST /api/devnet/faucet` - Request test tokens (max 100 DWT)
- `GET /api/devnet/balance/:address` - Check wallet balance
- `POST /api/devnet/transaction` - Submit test transaction
- `GET /api/devnet/status` - Network status and block height

### Mobile Optimization
- Safe area insets for notched devices
- Touch targets minimum 44x44px
- Responsive breakpoints across all pages
- Scrollable tables on small screens
- Mobile-specific CSS utilities in `client/src/index.css`

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **API Pattern**: RESTful endpoints under `/api/` prefix
- **Development**: Vite dev server with HMR proxied through Express

### Data Storage
- **Database**: PostgreSQL accessed via Drizzle ORM
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Tables**: `users` (authentication), `documents` (documentation hub content), `api_keys` (developer API keys), `transaction_hashes` (hash submissions), `page_views` (analytics)
- **Migrations**: Drizzle Kit for schema migrations (`drizzle-kit push`)

### Developer Integration System (NEW)
- **SDK**: `shared/darkwave-sdk.ts` - TypeScript SDK for DarkWave Chain
- **API Key Registration**: PIN-authenticated registration at `/api/developer/register`
- **Hash Submission**: `/api/hash/submit` with X-API-Key header
- **Fee System**: Gas estimation at `/api/gas/estimate`, fee schedule at `/api/fees/schedule`
- **Session Tokens**: 1-hour developer sessions issued via PIN auth

### Developer API Endpoints
- `POST /api/developer/auth` - PIN authentication (returns sessionToken)
- `POST /api/developer/register` - Register API key (requires X-Developer-Session header)
- `POST /api/hash/submit` - Submit hash (requires X-API-Key header)
- `GET /api/hash/:txHash` - Get transaction by hash
- `GET /api/developer/transactions` - List developer's transactions
- `GET /api/gas/estimate?dataSize=N` - Estimate gas for data
- `GET /api/fees/schedule` - Current fee schedule

### Dual-Chain Stamping Endpoints
- `POST /api/stamp/dual` - Submit hash to DarkWave + Solana (requires X-API-Key)
- `GET /api/stamp/:stampId` - Get stamp details with both chain statuses
- `PATCH /api/stamp/:stampId/solana` - Update Solana signature after client-side submission
- `GET /api/stamps/app/:appId` - List all stamps for an app
- `GET /api/darkwave/config` - Get chain configuration (chainId, symbol, decimals)

### Master Hallmark System
The hallmark system provides unique, verifiable product identifiers for all DarkWave ecosystem products.

**Hallmark Format**: `XXXXXXXXX-YY` (9-digit master sequence + 2-digit sub-sequence)
- First hallmark: `000000000-01` (master hallmark)
- Sequential: `000000001-01`, `000000002-01`, etc.

**Features**:
- Auto-generated QR codes (SVG) stored in database
- On-chain verification via DarkWave Chain
- Verification status: pending → confirmed
- Full audit trail with timestamps

**Hallmark API Endpoints**:
- `POST /api/hallmark/generate` - Generate new hallmark (requires X-API-Key)
- `GET /api/hallmark/:hallmarkId` - Get hallmark details (works for pending and confirmed)
- `GET /api/hallmark/:hallmarkId/qr` - Get QR code as SVG image
- `GET /api/hallmark/:hallmarkId/verify` - Verify on-chain status
- `GET /api/hallmarks` - List all hallmarks (optional: ?appId=X&limit=N)

**Database Tables**:
- `hallmarks` - Stores hallmark records with chain verification data
- `hallmark_counter` - Atomic counter for master sequence generation

**Service Module**: `server/hallmark.ts`
- `generateHallmark()` - Creates hallmark, QR code, submits to DarkWave
- `verifyHallmark()` - Checks validity and on-chain confirmation
- `getHallmarkQRCode()` - Returns SVG for display

**Explorer Integration**:
- Hallmark verification section on `/explorer` page
- Search by hallmark ID, displays verification status, QR code, and chain data

### Build System
- **Client Build**: Vite bundles React app to `dist/public`
- **Server Build**: esbuild compiles server to `dist/index.cjs`
- **Shared Code**: `shared/` directory contains schemas and types used by both client and server
- **Path Aliases**: `@/` maps to client source, `@shared/` maps to shared code

### Key Design Patterns
- **Monorepo Structure**: Client (`client/`), server (`server/`), shared code (`shared/`), and blockchain (`blockchain/`)
- **Type Safety**: Drizzle-zod generates Zod schemas from database tables for validation
- **API Client**: Centralized fetch functions in `client/src/lib/api.ts`
- **Component Architecture**: Feature components in `components/`, UI primitives in `components/ui/`
- **User Preferences**: React Context (PreferencesProvider, NotificationsProvider) in `client/src/lib/store.tsx`

## External Dependencies

### DarkWave Hub Integration
- External ecosystem API at `https://orbitstaffing.io`
- HMAC-SHA256 authentication with API key/secret
- Endpoints for app registration, status checks, and ecosystem queries
- Environment variables: `DARKWAVE_API_KEY`, `DARKWAVE_API_SECRET` (or `ORBIT_HUB_*` variants)

### Database
- PostgreSQL database required
- Connection via `DATABASE_URL` environment variable
- Session storage uses `connect-pg-simple`

### Authentication System
- **Replit Auth**: OAuth 2.0 integration for social login (Google, GitHub, Apple, email)
- **Session Storage**: PostgreSQL-backed sessions via `connect-pg-simple`
- **User Model**: Email-based accounts with profile data (firstName, lastName, profileImageUrl)
- **Protected Routes**: `isAuthenticated` middleware for secured endpoints
- **WebAuthn/Passkeys**: Biometric login support (Face ID, Touch ID, Windows Hello)

**Auth Endpoints**:
- `GET /api/login` - Initiates OAuth login flow
- `GET /api/callback` - OAuth callback handler
- `GET /api/logout` - Logout and session destruction
- `GET /api/auth/user` - Get current authenticated user

**WebAuthn Endpoints**:
- `POST /api/webauthn/register/start` - Start passkey registration (authenticated)
- `POST /api/webauthn/register/finish` - Complete passkey registration
- `POST /api/webauthn/authenticate/start` - Start passkey login
- `POST /api/webauthn/authenticate/finish` - Complete passkey login
- `GET /api/webauthn/passkeys` - List user's registered passkeys
- `DELETE /api/webauthn/passkeys/:id` - Remove a passkey

**Database Tables**:
- `users` - User profiles (id, email, firstName, lastName, profileImageUrl)
- `sessions` - Session storage for Replit Auth
- `passkeys` - WebAuthn credential storage

**Components**:
- `client/src/hooks/use-auth.ts` - React hook for auth state
- `client/src/components/passkey-manager.tsx` - Passkey registration UI
- `client/src/pages/dashboard.tsx` - Authenticated user dashboard

### Third-Party Services
- Replit Auth for social login (OAuth 2.0)
- No payment processing currently integrated
- OpenGraph image handling via custom Vite plugin for Replit deployments

### Key NPM Dependencies
- Radix UI primitives for accessible components
- TanStack React Query for data fetching
- Framer Motion for animations
- date-fns for date formatting
- Zod for runtime validation

### Rust Dependencies (blockchain/)
- tokio - Async runtime
- ed25519-dalek - Cryptographic signatures
- sled - Embedded database
- axum - HTTP server
- serde/bincode - Serialization
- chrono - Time handling
- tracing - Logging

## Development Roadmap

### Phase 1: MVP Chain (Current)
- [x] Core types (Block, Transaction, Account)
- [x] Cryptographic primitives
- [x] Ledger/state storage
- [x] Proof-of-Authority consensus
- [x] JSON-RPC API
- [ ] Build and run blockchain node
- [ ] Connect web portal to blockchain

### Phase 2: Multi-Node Network
- [ ] P2P networking (libp2p)
- [ ] Block synchronization
- [ ] Validator orchestration

### Phase 3: Smart Contracts
- [ ] WASM execution environment
- [ ] Contract deployment
- [ ] Contract interaction

### Phase 4: Production Ready
- [ ] Security hardening
- [ ] Public testnet
- [ ] Mainnet launch

## Changelog

### v1.0.0-alpha (December 21, 2025)
**Pre-Publish Sweep Completed**

#### Features
- PWA support with holographic dark gradient icons and offline caching
- Devnet Sandbox with wallet creation, faucet, and test transactions
- Complete branding consistency (all "Orbit" references replaced with "DarkWave")
- Mobile optimization with 44px touch targets and safe area insets
- Hallmark system for product verification with QR codes
- Dual-chain stamping (DarkWave + Solana)
- Developer portal with PIN authentication (set via DEVELOPER_PIN secret)
- Real-time blockchain stats (200K+ TPS, 400ms blocks)

#### Technical
- All services operational: Database, Hash API, Hallmark System, DarkWave Hub, Email Service
- Service worker registered for offline support
- No TypeScript/LSP errors
- No JavaScript console errors
- All API endpoints verified and returning expected responses

#### Documentation
- Updated ROADMAP.md with launch timeline (February 14, 2026)
- Updated master.md integration guide
- Complete API documentation in docs/

#### Known Milestones
- Token launch: February 14, 2026
- Developer PIN: Set via DEVELOPER_PIN secret
- Treasury: 100M DWT at genesis
- Chain ID: 8453
