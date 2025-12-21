# DarkWave Chain - Replit Agent Guide

## Overview

DarkWave Chain is a comprehensive blockchain ecosystem developed by DarkWave Studios. It comprises a Layer 1 Proof-of-Authority blockchain implemented in Rust and a React web application called DarkWave Portal. The portal acts as the ecosystem's interface, a block explorer, and a developer hub. The project aims to deliver a blockchain solution that surpasses Solana and Ethereum in speed, stability, and feature richness.

## User Preferences

Preferred communication style: Simple, everyday language.
User wants: Full blockchain implementation, not just a web portal. No piggybacking on other chains.

## System Architecture

### Blockchain Architecture (`blockchain/`)
The blockchain is built in Rust, utilizing a Proof-of-Authority (PoA) consensus mechanism with rotating validators. Data storage is managed by the Sled embedded database for ledger, accounts, and transactions. Cryptography relies on Ed25519 signatures, SHA-256 hashing, and Merkle trees. An Axum-based JSON-RPC server provides external communication.

### Web Portal Architecture
**Frontend**: Developed with React 18 and TypeScript, using Vite, Wouter for routing, TanStack React Query for server state, and React Context for local state. UI components are built using shadcn/ui on Radix UI primitives, styled with Tailwind CSS v4 and animated with Framer Motion.
**Key Features**: Global search, theme toggle, notification system, favorites, mobile navigation, a Devnet Sandbox for live testing, real-time blockchain stats via WebSocket, and PWA support.
**DarkWave Studio**: A web-based IDE platform with a Monaco-style editor, file management, secrets, configurations, multi-language support, Git integration (commit, history, branching), client-side code execution, and live HTML preview.
**PWA Implementation**: Includes a manifest, service worker for offline caching, and various icon sizes.
**Mobile Optimization**: Ensures responsive design with safe area insets, appropriate touch targets, and mobile-specific CSS.
**Backend**: Powered by Node.js with Express.js, TypeScript, and Drizzle ORM for PostgreSQL. API follows a RESTful pattern.
**Data Storage**: PostgreSQL is used with Drizzle ORM for schema management, including tables for users, documents, API keys, transactions, and page views.
**Developer Integration System**: Features a TypeScript SDK, PIN-authenticated API key registration, hash submission, gas estimation, fee schedules, and session tokens.
**Master Hallmark System**: Provides unique, verifiable product identifiers with auto-generated QR codes and on-chain verification, supported by dedicated API endpoints and database tables.
**Build System**: Vite for client, esbuild for server, shared code in `shared/`, and path aliases.
**Design Patterns**: Monorepo structure, type safety with Drizzle-zod, centralized API client, and component-based UI architecture.

### UI/UX Decisions
- **Color Scheme**: Emphasizes a dark theme with vibrant accents, notably cyan (#00ffff) as the theme color for PWA.
- **Typography**: Custom font stack including Space Grotesk, Rajdhani, and Inter.
- **Design Elements**: Holographic dark gradient icons, emphasis on responsive design for various devices.

## External Dependencies

- **DarkWave Hub Integration**: External ecosystem API `https://orbitstaffing.io` using HMAC-SHA256 authentication.
- **Database**: PostgreSQL, connected via `DATABASE_URL` environment variable.
- **Authentication System**: Replit Auth (OAuth 2.0 for Google, GitHub, Apple, email), PostgreSQL-backed sessions, and WebAuthn/Passkeys for biometric login.
- **Third-Party Services**:
    - Stripe for card payments.
    - Coinbase Commerce for crypto payments (BTC, ETH, USDC).
    - OpenGraph for image handling.
- **Key NPM Dependencies**: Radix UI, TanStack React Query, Framer Motion, date-fns, Zod.
- **Rust Dependencies (blockchain/)**: tokio, ed25519-dalek, sled, axum, serde/bincode, chrono, tracing.