# Verdara - Agent Handoff Document
## AI-Powered Arborist & Tree Service Platform

---

## Domain & Registry

- **Registered Domain**: `verdara.tlid` (lifetime, registered in DarkWave Trust Layer domain registry)
- **Target URL**: `https://verdara.io`
- **Gateway**: Once `tlid.io` DNS is live, `verdara.tlid.io` will redirect to `verdara.io`
- **Owner Address**: `0xDarkWaveFounder001`
- **Registry**: Part of a 28-app ecosystem under the DarkWave Trust Layer

## What is Verdara?

An AI-powered arborist and tree service platform built for the average homeowner who needs to deal with trees on their property. The core feature is AI tree measurement from a phone camera, with everything else built around that central tool.

## Core Feature: AI Tree Measurement

- Measure tree height, trunk diameter (DBH), lean angle, and canopy spread from phone photos
- Uses camera + reference object (person, car, known measurement) for calibration
- Outputs professional-grade measurements the user can act on or share with a pro

## Key Features That Would Make This Stand Out

### Safety & Planning Tools
- **Hazard Assessment**: AI analyzes tree health, lean, root exposure, dead branches — tells the user if this is a DIY job or call-a-pro situation
- **Drop Zone Calculator**: Based on tree height, lean angle, and surroundings — shows exactly where the tree will land with a visual overlay on the camera view
- **Cut Plan Generator**: Step-by-step felling plan with notch placement, hinge wood calculations, and escape route mapping

### AI Identification & Knowledge
- **Species ID from Photos**: Identify tree species, wood hardness, typical behavior when cut (does it twist? barber-chair risk?)
- **Health Diagnosis**: Spot disease, rot, pest damage, structural weakness from photos
- **Seasonal Guidance**: Best time to prune/fell based on species and region

### Practical Tools for the Average Person
- **Cost Estimator**: "What would a pro charge for this job?" based on tree size, location, complexity, and regional rates
- **Equipment Recommender**: What chainsaw size, safety gear, and tools you need for this specific job
- **Safety Checklists**: Pre-cut, during-cut, and post-cut checklists with gear verification
- **Stump Removal Guide**: Options and methods based on stump size and root system

### Documentation & Records
- **Before/After Photo Journal**: Document the whole job, blockchain-stamped on Trust Layer for insurance/property records
- **Property Tree Inventory**: Map and catalog all trees on your property with health scores and maintenance schedules
- **Insurance Documentation**: Generate reports suitable for insurance claims (storm damage, property damage, preventive removal)

### Community & Marketplace
- **Local Pro Finder**: Connect with verified arborists in your area (Trust Layer verified)
- **Wood Marketplace**: Sell or give away cut wood — firewood, lumber, woodworking stock
- **Equipment Rental/Share**: Borrow or rent chainsaws, chippers, stump grinders from neighbors

### Secondary Features (Built Around the Core)
- **Plant & Tree ID**: General plant identification beyond just trees
- **Garden Planning**: Shade mapping based on your tree inventory — where to plant what
- **Foraging Guide**: Edible trees, nuts, fruits on your property with safety verification
- **Wildlife Habitat Assessment**: What lives in your trees, protected species alerts before cutting

## Trust Layer Integration Points

- **Blockchain-Stamped Measurements**: Every AI measurement gets a Trust Layer stamp — verifiable, immutable record
- **Verified Pro Network**: Arborists earn trust scores through completed jobs and certifications
- **Property Records**: Tree inventories and removal documentation stamped for legal/insurance purposes
- **Equipment Provenance**: Track maintenance history of shared/rented equipment

## Design Guidelines (DarkWave Ecosystem Standard)

- **Theme**: Dark theme only (bg-slate-950/bg-slate-900)
- **UI Framework**: React 18, TypeScript, Vite, Tailwind CSS v4, Framer Motion
- **Components**: Glassmorphism cards (bg-white/5, backdrop-blur-xl, border-white/10)
- **Color Palette for Verdara**: Consider earthy greens (emerald-500, green-600) as primary accent instead of the ecosystem's cyan, while keeping the dark theme base
- **Mobile-First**: 44px minimum touch targets, responsive across all breakpoints
- **Animations**: Framer Motion for page transitions, hover effects, interactive elements
- **Premium Feel**: Everything should feel polished — glow effects, gradient text, smooth transitions

## Tech Stack (Ecosystem Standard)

- **Frontend**: React 18 + TypeScript + Vite + Wouter (routing) + TanStack Query + Tailwind CSS v4
- **Backend**: Node.js + Express.js + TypeScript + Drizzle ORM + PostgreSQL
- **AI**: OpenAI GPT-4o for analysis, potentially vision API for tree measurement
- **Auth**: Can integrate with Trust Layer ecosystem SSO or standalone auth
- **Payments**: Stripe (already configured in ecosystem)

## Domain Registry Technical Details

The `.tlid` domain system works as follows:
- Domains are stored in a PostgreSQL `blockchain_domains` table
- Each domain has: name, tld, ownerAddress, website, description, and optional social links
- The TLID Gateway (server middleware) intercepts requests to `*.tlid.io` subdomains
- When someone visits `verdara.tlid.io`, the gateway looks up `verdara` in the database and redirects (301) to the configured website URL
- Domain records support additional DNS-like entries (A, CNAME, TXT, etc.) via the `domain_records` table
- All registrations are Trust Layer stamped with a transaction hash

## Ecosystem Context

Verdara is app #28 in the DarkWave Trust Layer ecosystem. Other apps include Chronicles (gaming), Guardian (AI security), Pulse (market intelligence), ORBIT (staffing), and 23 others. The ecosystem shares SSO, blockchain verification, and the `.tlid` domain registry.

---

*Registered: February 19, 2026*
*DarkWave Trust Layer Ecosystem*
