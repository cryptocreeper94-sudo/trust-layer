# TLID.io Subdomain Registry

All ecosystem apps are accessible via branded `.tlid.io` subdomains.
These subdomains require a wildcard A record (`*`) at your DNS registrar (Namecheap)
pointing to the same IP address as your main `tlid.io` domain.

Each subdomain must also be added as a custom domain in Replit's publish settings.

---

## DNS Setup (Namecheap - One Time)

1. Log in to Namecheap > Domain List > Manage `tlid.io` > Advanced DNS
2. Find the IP address from your existing `tlid.io` A record
3. Add: **A Record** | Host: `*` | Value: *(same IP)* | TTL: Automatic

---

## Subdomains to Add in Replit Publish Settings

Add each of these as a custom domain when publishing:

| # | Subdomain | App Name | Type |
|---|-----------|----------|------|
| 1 | `academy.tlid.io` | DarkWave Academy | Internal |
| 2 | `arbora.tlid.io` | Arbora | External |
| 3 | `arcade.tlid.io` | The Arcade | Internal |
| 4 | `brewboard.tlid.io` | Brew & Board Coffee | External |
| 5 | `chronicles.tlid.io` | Chronicles | Internal |
| 6 | `darkwave.tlid.io` | DarkWave | Internal |
| 7 | `darkwavegames.tlid.io` | DarkWave Games | Internal |
| 8 | `darkwavestudios.tlid.io` | DarkWave Studios | External |
| 9 | `driverconnect.tlid.io` | TL Driver Connect | External |
| 10 | `dwsc.tlid.io` | DWSC | Internal |
| 11 | `garagebot.tlid.io` | GarageBot | External |
| 12 | `guardian.tlid.io` | Guardian | Internal |
| 13 | `guardianai.tlid.io` | Guardian AI | Internal |
| 14 | `guardianscanner.tlid.io` | Guardian Scanner | Internal |
| 15 | `guardianscreener.tlid.io` | Guardian Screener | Internal |
| 16 | `lotopspro.tlid.io` | Lot Ops Pro | External |
| 17 | `nashpaintpros.tlid.io` | Nashville Painting Pros | External |
| 18 | `orbit.tlid.io` | ORBIT Staffing OS | External |
| 19 | `orby.tlid.io` | Orby | External |
| 20 | `paintpros.tlid.io` | PaintPros | External |
| 21 | `pulse.tlid.io` | Pulse | External |
| 22 | `signalchat.tlid.io` | Signal Chat | Internal |
| 23 | `strikeagent.tlid.io` | StrikeAgent | External |
| 24 | `thevoid.tlid.io` | The Void | Internal |
| 25 | `throughtheveil.tlid.io` | Through The Veil | Internal |
| 26 | `tlid.tlid.io` | TLID.io | Internal |
| 27 | `torque.tlid.io` | Torque | Internal |
| 28 | `tradeworks.tlid.io` | TradeWorks AI | External |
| 29 | `trusthome.tlid.io` | Trust Home | Internal |
| 30 | `trustlayer.tlid.io` | Trust Layer | Internal |
| 31 | `trustshield.tlid.io` | TrustShield | Internal |
| 32 | `trustvault.tlid.io` | Trust Vault | Internal |
| 33 | `vedasolus.tlid.io` | VedaSolus | External |
| 34 | `verdara.tlid.io` | Verdara | External |
| 35 | `yourlegacy.tlid.io` | Your Legacy | Internal |

---

## Types

- **Internal** = Hosted within this Replit app (gateway routes to the correct page)
- **External** = Hosted on a separate Replit project or external server (gateway redirects)

---

## Quick Copy List (for Replit Publish Settings)

```
academy.tlid.io
arbora.tlid.io
arcade.tlid.io
brewboard.tlid.io
chronicles.tlid.io
darkwave.tlid.io
darkwavegames.tlid.io
darkwavestudios.tlid.io
driverconnect.tlid.io
dwsc.tlid.io
garagebot.tlid.io
guardian.tlid.io
guardianai.tlid.io
guardianscanner.tlid.io
guardianscreener.tlid.io
lotopspro.tlid.io
nashpaintpros.tlid.io
orbit.tlid.io
orby.tlid.io
paintpros.tlid.io
pulse.tlid.io
signalchat.tlid.io
strikeagent.tlid.io
thevoid.tlid.io
throughtheveil.tlid.io
tlid.tlid.io
torque.tlid.io
tradeworks.tlid.io
trusthome.tlid.io
trustlayer.tlid.io
trustshield.tlid.io
trustvault.tlid.io
vedasolus.tlid.io
verdara.tlid.io
yourlegacy.tlid.io
```
