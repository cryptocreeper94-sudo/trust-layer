# DarkWave Chain - Replit Agent Guide

## Overview

DarkWave Chain is a complete blockchain ecosystem by DarkWave Studios, consisting of two main components:

1. **DarkWave Chain Blockchain** (`blockchain/`) - A real Layer 1 blockchain implementation in Rust with Proof-of-Authority consensus
2. **DarkWave Portal** (`client/`, `server/`) - A React web application serving as the ecosystem interface, block explorer, and developer hub

The project goal is to build a blockchain that is faster, more stable, and feature-rich than Solana and Ethereum.

## User Preferences

Preferred communication style: Simple, everyday language.
User wants: Full blockchain implementation, not just a web portal. No piggybacking on other chains.

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
- API Playground for testing chain abstraction APIs
- Real-time blockchain stats via WebSocket

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

### Third-Party Services
- No external auth providers configured (local user/password in database)
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
