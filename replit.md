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
**DarkWave Studio**: A proprietary web-based IDE platform at `/studio`. 

#### DarkWave Studio Features (Completed)
- **Phase 1 - Core IDE**: Code editor (textarea), file tree, create/edit/delete files, secrets management, configuration variables, project CRUD
- **Phase 2 - Version Control**: Git commits, branch management, checkout, commit history, console output, live preview iframe
- **Phase 3 - Advanced Features**:
  - Terminal emulator with simulated shell commands (ls, pwd, node -v, npm -v, python --version, help, clear)
  - Deployment system with status tracking (building → live), auto-generated .darkwave.app URLs
  - Package manager integration (auto-detects npm/pip from package.json or requirements.txt)
  - Custom domain linking for deployed projects
  - Real-time collaboration with WebSocket presence indicators showing active users and their current file

#### DarkWave Studio Phase 4 (In Progress)
- **Monaco Editor Integration** (COMPLETED): Full-featured code editor loaded via CDN with syntax highlighting for 70+ languages, IntelliSense, minimap, code folding, and dark theme
- **Multi-file Tabs** (COMPLETED): Tabbed interface showing all open files with amber pulsing unsaved changes indicators, close buttons, and active tab highlighting with cyan border
- **Search/Replace** (COMPLETED): Global search across all project files with line-by-line results, file jumping, and replace-all functionality accessible via Search tab in sidebar
- **Project Templates** (COMPLETED): React, Node.js Express, and Python Flask starter templates that auto-generate complete project structures when project has no files
- **Keyboard Shortcuts** (COMPLETED): Panel accessible via Ctrl+/ showing all shortcuts (Ctrl+S save, Ctrl+F search, Ctrl+B console, Esc close)
- **File Rename** (COMPLETED): Inline file renaming with Edit2 button, Enter to confirm, Escape to cancel
- **File Upload/Download** (COMPLETED): Upload button with multi-file support, download button on each file in file tree (guards against empty content and folders)
- **Environment Variables UI** (COMPLETED): Dev/prod toggle buttons in Secrets tab, environment-scoped secrets/configs with environment field in database
- **Console Log Filtering** (COMPLETED): Filter input with clear button in console tab, case-insensitive search across all log entries
- **Project Settings Panel** (COMPLETED): Settings modal with project name editing, project ID display with copy button, and file/commit statistics

#### Monaco Editor Technical Details
- **CDN Loading**: Monaco v0.52.2 loaded from cdnjs.cloudflare.com
- **Component**: `client/src/components/monaco-editor.tsx` - React wrapper with automatic language detection
- **Features**: Syntax highlighting, line numbers, minimap, bracket matching, smooth scrolling
- **Languages**: JavaScript, TypeScript, JSON, HTML, CSS, Python, Rust, Go, and more
- **Theme**: vs-dark (matches Studio dark theme)

#### Studio Technical Details
- **WebSocket**: `/ws/studio` for real-time collaboration presence
- **API Endpoints**:
  - `GET/POST /api/studio/projects` - List/create projects
  - `GET /api/studio/projects/:id` - Get project with files, secrets, configs
  - `POST /api/studio/projects/:id/files` - Create file
  - `PATCH/DELETE /api/studio/files/:id` - Update/delete file
  - `POST /api/studio/projects/:id/terminal` - Execute terminal command
  - `POST /api/studio/projects/:id/deploy` - Start deployment
  - `GET /api/studio/deployments/:id` - Get deployment status
  - `PATCH /api/studio/deployments/:id/domain` - Set custom domain
  - `POST/DELETE /api/studio/projects/:id/packages` - Install/remove packages
  - `POST /api/studio/projects/:id/commits` - Create git commit
  - `GET /api/studio/projects/:id/commits` - List commits
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