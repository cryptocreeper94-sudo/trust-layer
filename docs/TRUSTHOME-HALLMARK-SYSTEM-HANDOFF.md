# TrustHome — Hallmark System Integration Handoff

## What Is the Hallmark System?

The Hallmark System is Trust Layer's on-chain audit trail. Every significant event in the ecosystem gets a **SHA-256 data hash** submitted to the DarkWave blockchain, producing a permanent, verifiable record with a transaction hash and block height. Think of it as a tamper-proof receipt for everything that matters.

There are two layers:

1. **Trust Stamps** — lightweight, automatic audit trail entries for everyday actions (logins, purchases, profile updates). These fire in the background without user interaction.
2. **Hallmarks** — formal, numbered verification records for major events (app releases, certifications, property verifications). These produce a scannable QR code and a public verification URL.

---

## TrustHome Numbering: `TH-00000001`

TrustHome uses its own namespaced numbering within the Hallmark system:

- **Format**: `TH-XXXXXXXX` (8-digit zero-padded)
- **Examples**: `TH-00000001`, `TH-00000042`, `TH-00012500`
- **Scope**: TrustHome-specific hallmarks only — this counter is independent from the global master sequence

### How to Implement the Counter

```typescript
// In your TrustHome backend, maintain a simple counter
// Option A: Use a dedicated DB row
const nextTH = await db.select().from(trusthomeCounter).where(eq(id, "th-master"));
const nextNum = parseInt(nextTH.currentSequence) + 1;
const thId = `TH-${String(nextNum).padStart(8, '0')}`;
await db.update(trusthomeCounter).set({ currentSequence: String(nextNum) });

// Option B: Call the Trust Layer API (preferred for Hub app)
POST /api/hallmark/generate
{
  "appId": "trusthome",
  "appName": "TrustHome",
  "productName": "Agent Verification",
  "version": "1.0.0",
  "releaseType": "verification",
  "metadata": {
    "thId": "TH-00000001",
    "agentId": "agent-xyz",
    "eventType": "agent-verified",
    ...eventSpecificData
  }
}
```

---

## How the Hash Pipeline Works

```
Event Occurs
    ↓
Build payload object (JSON with all event data)
    ↓
SHA-256 hash the payload → dataHash (0x...)
    ↓
Submit dataHash to DarkWave blockchain → txHash + blockHeight
    ↓
Store record in hallmarks/trust_stamps table
    ↓
(Hallmarks only) Generate QR code with verification URL
```

### Key Files on Trust Layer Backend

| File | Purpose |
|------|---------|
| `server/hallmark.ts` | `generateHallmark()` — creates numbered, QR-coded records |
| `server/trust-stamp.ts` | `trustStamp(category, data)` — lightweight audit trail |
| `server/darkwave.ts` | `submitHashToDarkWave()` — sends hash to blockchain |
| `server/blockchain-engine.ts` | Core chain engine — block production, tx hashing |
| `shared/schema.ts` | DB tables: `hallmarks`, `trust_stamps`, `hallmark_counter` |

### Trust Stamp (Quick Fire-and-Forget)

```typescript
import { trustStamp } from "./trust-stamp";

// Automatically hashes, submits to chain, and stores
await trustStamp("agent-profile-created", {
  userId: agent.userId,
  agentId: agent.id,
  agentName: agent.name,
  licenseNumber: agent.license,
  state: agent.state,
});
```

### Hallmark (Formal Numbered Record with QR)

```typescript
import { generateHallmark } from "./hallmark";

const result = await generateHallmark({
  appId: "trusthome",
  appName: "TrustHome",
  productName: "Property Listing Verification",
  version: "1.0.0",
  releaseType: "verification",
  metadata: {
    thId: "TH-00000001",
    propertyAddress: "123 Main St",
    mlsNumber: "MLS-12345",
    listPrice: 450000,
    agentId: "agent-xyz",
    verifiedAt: new Date().toISOString(),
  },
});

// result.hallmark.hallmarkId → "000042-01" (global master sequence)
// result.hallmark.darkwave.txHash → "0xabc123..."
// result.hallmark.darkwave.blockHeight → "5586200"
// result.hallmark.qrCodeSvg → SVG string for QR code
```

---

## Major Events to Hash to Blockchain

### Tier 1 — Hallmarks (Formal numbered records, QR codes)

These are the big-deal events that get a `TH-XXXXXXXX` number and a verifiable QR code:

| Event | Category | What Gets Hashed |
|-------|----------|-----------------|
| **Agent Profile Verified** | `agent-verified` | Agent name, license #, brokerage, state, verification date |
| **Property Listed** | `property-listed` | Address, MLS #, list price, agent ID, listing date, property type |
| **Property Sold/Closed** | `property-closed` | Address, sale price, buyer (anonymized), closing date, agent ID |
| **Client Agreement Signed** | `agreement-signed` | Agreement type, client ID (hashed), agent ID, terms hash, date |
| **Trust Score Milestone** | `trust-score-milestone` | Agent ID, old score, new score, milestone level (Bronze/Silver/Gold/Platinum) |
| **Agent Certification** | `agent-certified` | Agent ID, certification type, issuing body, expiration date |
| **Brokerage Onboarded** | `brokerage-onboarded` | Brokerage name, license #, state, number of agents, date |

### Tier 2 — Trust Stamps (Automatic background audit trail)

These fire automatically and don't need a TH number — they just build the audit trail:

| Event | Category | What Gets Hashed |
|-------|----------|-----------------|
| **Agent Login** | `trusthome-login` | Agent ID, IP hash, device fingerprint, timestamp |
| **Profile Updated** | `trusthome-profile-update` | Agent ID, fields changed (keys only, not values), timestamp |
| **Property Photo Uploaded** | `trusthome-photo-upload` | Property ID, photo hash (SHA-256 of image bytes), upload date |
| **Client Added** | `trusthome-client-added` | Agent ID, client ID (hashed), relationship type, date |
| **Showing Scheduled** | `trusthome-showing-scheduled` | Property ID, agent ID, showing date, client count |
| **Price Changed** | `trusthome-price-change` | Property ID, old price, new price, agent ID, date |
| **Document Uploaded** | `trusthome-document-upload` | Document type, file hash, agent ID, property ID, date |
| **Review Submitted** | `trusthome-review-submitted` | Reviewer ID (hashed), agent ID, rating, date |
| **Offer Submitted** | `trusthome-offer-submitted` | Property ID, agent ID, offer amount (range), date |
| **Lead Assigned** | `trusthome-lead-assigned` | Lead source, agent ID, assignment date |

---

## API Endpoints for Hub App Integration

The Trust Layer Hub app should call these endpoints to interact with the Hallmark system:

### Create a Hallmark

```
POST /api/hallmark/generate
Content-Type: application/json
Authorization: Bearer <session-token>

{
  "appId": "trusthome",
  "appName": "TrustHome",
  "productName": "Agent Verification",
  "releaseType": "verification",
  "metadata": { ... }
}

Response:
{
  "success": true,
  "hallmark": {
    "hallmarkId": "000042-01",
    "masterSequence": "000042",
    "subSequence": "01",
    "qrCodeSvg": "<svg>...</svg>",
    "verificationUrl": "https://darkwave.chain/hallmark/000042-01",
    "darkwave": {
      "txHash": "0xabc123...",
      "blockHeight": "5586200",
      "status": "confirmed"
    }
  }
}
```

### Verify a Hallmark

```
GET /api/hallmark/verify/:hallmarkId

Response:
{
  "valid": true,
  "hallmark": { ...full hallmark record },
  "onChain": true,
  "message": "Verified on Trust Layer (Block 5586200)"
}
```

### Create a Trust Stamp

```
POST /api/trust-stamp
Content-Type: application/json
Authorization: Bearer <session-token>

{
  "category": "trusthome-property-listed",
  "data": {
    "userId": "agent-xyz",
    "propertyId": "prop-123",
    "address": "123 Main St",
    "listPrice": 450000
  }
}

Response:
{
  "success": true,
  "txHash": "0xdef456...",
  "blockHeight": 5586201,
  "dataHash": "0x789abc...",
  "category": "trusthome-property-listed",
  "timestamp": "2026-03-03T06:45:00.000Z"
}
```

### Get User's Trust Stamps

```
GET /api/trust-stamps/:userId

Response: Array of trust stamp records
```

---

## Setup Checklist for Hub App

1. **Add TrustHome counter table** (if managing TH-numbers locally):
   ```sql
   CREATE TABLE IF NOT EXISTS trusthome_counter (
     id VARCHAR PRIMARY KEY DEFAULT 'th-master',
     current_sequence TEXT NOT NULL DEFAULT '0'
   );
   ```

2. **Wire up Hallmark calls** — after every Tier 1 event, call `POST /api/hallmark/generate` with `appId: "trusthome"`

3. **Wire up Trust Stamp calls** — after every Tier 2 event, call `POST /api/trust-stamp` with the appropriate category prefixed with `trusthome-`

4. **Display verification badges** — when showing agent profiles or property listings, display the QR code from the hallmark and a "Verified on Trust Layer" badge with the block height

5. **Transaction history** — all hallmarks and trust stamps are queryable via the API for display in agent dashboards and property detail views

6. **Category naming convention**: All TrustHome categories should be prefixed with `trusthome-` to distinguish them in the global audit trail

---

## Existing Numbering Systems Across the Ecosystem

| System | Format | Scope |
|--------|--------|-------|
| **Trust Layer ID** | `TL-XXXXXX` | User identity across ecosystem |
| **Member Number** | `#1,234` | Sequential user signup order |
| **Hallmark Master** | `000042-01` | Global hallmark counter (all apps) |
| **Hallmark Serial** | 12-digit | Individual mint serial numbers |
| **TrustHome** | `TH-00000001` | TrustHome-specific event counter |

### Serial Ranges (Global Hallmark Mints)

| Tier | Range | Purpose |
|------|-------|---------|
| Genesis Founders | 1 – 10,000 | Ultra-rare first 10K |
| Legacy Founders | 10,001 – 50,000 | Early adopters |
| Special Reserve | 50,001 – 300,000 | Partnerships, events |
| General Public | 300,001 – 999,999,999,999 | Everyone else |

---

## Architecture Notes

- **Blockchain**: DarkWave (BFT-PoA), Chain ID 8453, 400ms block time, ~200K TPS
- **Hash Algorithm**: SHA-256 for all data hashes
- **On-Chain Storage**: Only the hash goes on-chain (not the full data)
- **Off-Chain Storage**: Full metadata stored in PostgreSQL (`hallmarks` and `trust_stamps` tables)
- **QR Codes**: Generated server-side as SVG using the `qrcode` library
- **Verification**: Public endpoint — anyone can verify a hallmark by ID without auth
