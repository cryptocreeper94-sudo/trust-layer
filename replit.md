# Orbit Chain - Replit Agent Guide

## Overview

Orbit Chain is a decentralized blockchain ecosystem web application built as a modern full-stack TypeScript project. It serves as a portal for the "Orbit Ecosystem" - featuring ecosystem app discovery, blockchain explorer, token information, developer documentation, and API playground functionality. The application integrates with an external "DarkWave Hub" ecosystem API for app registry and cross-platform connectivity.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state, React Context for local preferences and notifications
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS v4 with custom theme configuration, Framer Motion for animations
- **Typography**: Custom font stack (Space Grotesk, Rajdhani, Inter)

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **API Pattern**: RESTful endpoints under `/api/` prefix
- **Development**: Vite dev server with HMR proxied through Express

### Data Storage
- **Database**: PostgreSQL accessed via Drizzle ORM
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Tables**: `users` (authentication), `documents` (documentation hub content)
- **Migrations**: Drizzle Kit for schema migrations (`drizzle-kit push`)

### Build System
- **Client Build**: Vite bundles React app to `dist/public`
- **Server Build**: esbuild compiles server to `dist/index.cjs`
- **Shared Code**: `shared/` directory contains schemas and types used by both client and server
- **Path Aliases**: `@/` maps to client source, `@shared/` maps to shared code

### Key Design Patterns
- **Monorepo Structure**: Client (`client/`), server (`server/`), and shared code (`shared/`) in single repository
- **Type Safety**: Drizzle-zod generates Zod schemas from database tables for validation
- **API Client**: Centralized fetch functions in `client/src/lib/api.ts`
- **Component Architecture**: Feature components in `components/`, UI primitives in `components/ui/`

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