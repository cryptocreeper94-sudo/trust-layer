# Trust Layer Hub — React Native + Expo App Specification

## Agent Handoff Document — Complete Build Reference

This document contains everything needed to build the **Trust Layer Hub** — a single React Native + Expo app that serves as the front door to the entire 32-app Trust Layer ecosystem. This app will be submitted to the Google Play Store and Apple App Store.

---

## 1. WHAT THIS APP IS

**Trust Layer Hub** is a native mobile app that:
- Showcases all 32 ecosystem apps with descriptions, images, and deep links
- Has REAL functionality (dashboard, wallet, chat, news) so Apple/Google accept it
- Drives SIG presale traffic with Shell purchases built in
- Provides single sign-on — log in once, authenticated across all apps
- Push notifications for ecosystem-wide announcements

**Think of it like:** The Google app linking to Gmail/Drive/Maps, or Meta Suite linking to Instagram/WhatsApp/Threads. One app, one download, one identity — gateway to everything.

**This is NOT a link farm.** Store reviewers reject apps that are just directories. This app has genuine standalone utility through its dashboard, wallet, messaging, and news features.

---

## 2. APP STORE REQUIREMENTS — NON-NEGOTIABLE

### Google Play Store
- Minimum Android API 24 (Android 7.0)
- 64-bit support required
- Target SDK must be current (API 34+)
- Privacy policy URL required
- Data safety section required
- Content rating questionnaire required
- App must have genuine functionality beyond linking to websites

### Apple App Store
- iOS 15.0 minimum deployment target
- Must work on iPhone and iPad (Universal)
- No "thin client" — Apple rejects apps that are just WebView wrappers with no native UI
- At least 3-4 screens must be fully native (not WebView)
- In-app purchases for digital goods MUST use Apple IAP (Shells/SIG purchases)
- Privacy nutrition labels required
- App Review Guidelines 4.2 (Minimum Functionality) — app must be "useful, unique, or provide some form of lasting entertainment"

### What Must Be Native (Not WebView)
To pass review, these screens MUST be built with React Native components:
1. **Dashboard / Home screen**
2. **App Directory**
3. **Wallet / Balance screen**
4. **Profile / Settings**
5. **Login / Registration**

Everything else CAN be WebView if needed (individual ecosystem apps open in an in-app browser).

---

## 3. TECH STACK

| Category | Technology |
|----------|-----------|
| Framework | React Native 0.76+ |
| Platform | Expo SDK 52+ (managed workflow) |
| Navigation | Expo Router (file-based routing) |
| Styling | NativeWind v4 (Tailwind for RN) |
| Animations | React Native Reanimated 3 + Moti |
| Icons | Lucide React Native |
| State | TanStack Query (React Query) v5 |
| Storage | Expo SecureStore (tokens), AsyncStorage (preferences) |
| HTTP | Axios or fetch with TanStack Query |
| Push Notifications | Expo Notifications |
| In-App Browser | Expo WebBrowser or react-native-webview |
| Charts | react-native-chart-kit or Victory Native |
| Blur/Glassmorphism | @react-native-community/blur or expo-blur |
| Linear Gradients | expo-linear-gradient |
| Haptics | expo-haptics |
| Payments | expo-in-app-purchases (Apple IAP / Google Play Billing) |
| Deep Linking | Expo Linking + Universal Links |

---

## 4. THE TRUST LAYER UI PROTOCOL — ADAPTED FOR NATIVE

The Trust Layer ecosystem uses a strict visual protocol. The native app MUST match this aesthetic precisely. Below is how each web pattern translates to React Native.

### 4.1 Theme — Dark Only
```
Background: #0c1224 (Deep Space Blue)
Surface: rgba(12, 18, 36, 0.65) — translucent cards
Primary: #00ffff (Cyan)
Secondary: #9333ea (Electric Purple)
Accent: #00ffff (same as Primary)
Text Primary: #ffffff
Text Secondary: rgba(255, 255, 255, 0.7)
Text Tertiary: rgba(255, 255, 255, 0.4)
Text Muted: rgba(255, 255, 255, 0.3)
Border: rgba(255, 255, 255, 0.08)
```

There is NO light mode. Do not build one. Do not add a toggle. Dark only.

### 4.2 GlassCard — The Core Component

Every card in the app uses glassmorphism. Build a reusable `GlassCard` component:

```tsx
// components/GlassCard.tsx
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface GlassCardProps {
  children: React.ReactNode;
  glow?: boolean;
  style?: any;
}

export function GlassCard({ children, glow = false, style }: GlassCardProps) {
  return (
    <View style={[styles.wrapper, style]}>
      {glow && (
        <LinearGradient
          colors={['rgba(0,255,255,0.15)', 'rgba(147,51,234,0.15)', 'rgba(0,255,255,0.15)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.glowBorder}
        />
      )}
      <BlurView intensity={40} tint="dark" style={styles.card}>
        <View style={styles.cardInner}>
          {children}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'relative' },
  glowBorder: {
    position: 'absolute',
    inset: -1,
    borderRadius: 13,
    opacity: 0.5,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  cardInner: {
    backgroundColor: 'rgba(12,18,36,0.65)',
    padding: 20,
  },
});
```

**CRITICAL RULE**: Padding goes INSIDE the card content, never on the card wrapper itself. The glassmorphism border and blur need to extend to the edges.

### 4.3 Layout — No Vertical Stacking

**Rule: Groups of 4+ same-type cards MUST be horizontal ScrollViews (carousels), never vertical lists.**

```tsx
// Horizontal card carousel inside a section
<View>
  <Text style={styles.sectionTitle}>Featured Apps</Text>
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
    snapToInterval={280}
    decelerationRate="fast"
  >
    {apps.map(app => (
      <View key={app.id} style={{ width: 260 }}>
        <GlassCard>
          {/* card content */}
        </GlassCard>
      </View>
    ))}
  </ScrollView>
</View>
```

### 4.4 Grid Layout
Use `flexWrap` for bento-style grids:
```tsx
<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: 16 }}>
  {items.map(item => (
    <View key={item.id} style={{ width: '48%' }}>
      <GlassCard>{/* content */}</GlassCard>
    </View>
  ))}
</View>
```

For true bento spanning (one card takes full width, others half):
```tsx
<View style={{ width: item.large ? '100%' : '48%' }}>
```

### 4.5 Gradient Text
```tsx
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

<MaskedView maskElement={<Text style={styles.title}>Headline</Text>}>
  <LinearGradient colors={['#22d3ee', '#a855f7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
    <Text style={[styles.title, { opacity: 0 }]}>Headline</Text>
  </LinearGradient>
</MaskedView>
```

### 4.6 Skeleton Loading
```tsx
import Animated, { useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';

function Skeleton({ width, height, borderRadius = 8 }) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withRepeat(withTiming(0.3, { duration: 800 }), -1, true),
  }));

  return (
    <Animated.View style={[{
      width, height, borderRadius,
      backgroundColor: 'rgba(255,255,255,0.05)',
    }, animatedStyle]} />
  );
}
```

### 4.7 Animations
Use Reanimated 3 + Moti for all animations:
```tsx
import { MotiView } from 'moti';

// Fade-in on mount
<MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400 }}>
  {/* content */}
</MotiView>

// Staggered list
{items.map((item, i) => (
  <MotiView key={i} from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: i * 100 }}>
    <GlassCard>{/* content */}</GlassCard>
  </MotiView>
))}
```

### 4.8 Background Glow Orbs
```tsx
// Positioned absolute behind content
<View style={StyleSheet.absoluteFill} pointerEvents="none">
  <LinearGradient
    colors={['rgba(0,255,255,0.06)', 'transparent']}
    style={{ position: 'absolute', top: -100, left: -50, width: 400, height: 400, borderRadius: 200 }}
  />
  <LinearGradient
    colors={['rgba(147,51,234,0.05)', 'transparent']}
    style={{ position: 'absolute', top: 200, right: -80, width: 500, height: 500, borderRadius: 250 }}
  />
</View>
```

### 4.9 Buttons
```tsx
// Primary CTA
<LinearGradient colors={['#06b6d4', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
  style={{ borderRadius: 12, overflow: 'hidden' }}>
  <Pressable style={{ paddingVertical: 14, paddingHorizontal: 24, alignItems: 'center' }}
    android_ripple={{ color: 'rgba(255,255,255,0.1)' }}>
    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Action</Text>
  </Pressable>
</LinearGradient>

// Touch targets: MINIMUM 44px height on all interactive elements
```

---

## 5. APP SCREENS & NAVIGATION

### Tab Bar (Bottom Navigation — 5 tabs)
```
🏠 Home        — Dashboard with ecosystem overview
🔍 Explore     — App directory, categories, search
💰 Wallet      — SIG balance, Shells, transaction history
💬 Chat        — Signal Chat (encrypted messaging)
👤 Profile     — Settings, identity, membership
```

### Screen Breakdown

#### 5.1 HOME (Dashboard)
**Purpose:** At-a-glance ecosystem overview. This is the first thing users see.

**Content:**
- **Welcome header** with user name and Trust Layer ID
- **Balance card** (GlassCard glow) — SIG balance, Shell balance, portfolio value
- **Quick actions row** — Buy Shells, Send SIG, Scan (Guardian), Bridge
- **News feed carousel** — Latest ecosystem announcements (horizontal scroll)
- **Featured apps carousel** — Spotlight 4-6 apps with images (horizontal scroll)
- **Activity feed** — Recent transactions, achievements, notifications (vertical list, max 5 items with "See All")
- **Launch countdown** — Days/Hours/Min/Sec to August 23, 2026

**Native requirement:** This screen MUST be 100% native React Native. No WebView.

#### 5.2 EXPLORE (App Directory)
**Purpose:** Browse and launch all 32 ecosystem apps.

**Content:**
- **Search bar** at top (filter apps by name)
- **Category tabs** (horizontal scroll): All, Core, DeFi, Security, Gaming, AI, Social, Business, Health, Services
- **App cards in grid** (2-column) — each card shows: icon, name, one-line description, category badge, "Open" button
- **Tapping an app** → opens detail modal with full description, screenshots, and "Launch" button
- **Launch button** → opens the app URL in an in-app browser (react-native-webview) or Expo WebBrowser

**Native requirement:** This screen MUST be 100% native. The launched apps can open in WebView.

#### 5.3 WALLET
**Purpose:** View balances, buy Shells, see transaction history.

**Content:**
- **Balance hero** — large SIG balance with fiat equivalent estimate
- **Shell balance** with "Buy Shells" button
- **Portfolio breakdown** — pie chart showing SIG, stSIG, NFTs
- **Transaction history** — scrollable list with icons, amounts, timestamps
- **Buy Shells flow** — uses Stripe (web) or Apple IAP / Google Play Billing (native) depending on platform

**IMPORTANT — Apple IAP Rule:** If selling Shells (digital currency) on iOS, you MUST use Apple In-App Purchases. Apple takes 30%. On Android, you can use Google Play Billing OR direct Stripe (though Play Store prefers their billing for digital goods). Plan pricing tiers accordingly.

**Shell purchase tiers:**
| Tier | Shells | Price |
|------|--------|-------|
| Starter | 5,000 | $5.00 |
| Builder | 25,000 | $25.00 |
| Whale | 100,000 | $100.00 |
| Custom | Variable | Variable |

**Native requirement:** This screen MUST be 100% native.

#### 5.4 CHAT (Signal Chat)
**Purpose:** Real-time encrypted messaging with blockchain-verified identities.

**Content:**
- **Channel list** — public channels + DMs
- **Message view** — real-time messages with user avatars, timestamps
- **Message input** — text input with send button
- **Typing indicators** — real-time "user is typing..."
- **Connection:** WebSocket to `wss://{server}/ws/chat`

This gives the app genuine social utility — a key factor for store approval.

**Native requirement:** Chat UI should be native. WebSocket connection to existing backend.

#### 5.5 PROFILE
**Purpose:** User identity, settings, membership.

**Content:**
- **Profile header** — avatar, name, Trust Layer ID, member number
- **THE VOID membership** status and tier
- **Guardian Security Score**
- **Settings** — notifications, security (PIN/biometrics), display preferences
- **Linked accounts** — which ecosystem apps are connected
- **Sign out**

**Native requirement:** This screen MUST be 100% native.

---

## 6. AUTHENTICATION

### Login Flow
The app connects to the existing Trust Layer backend API.

**Endpoints:**
```
POST /api/auth/login
  Body: { email, password }
  Response: { user, sessionToken }

POST /api/auth/register
  Body: { email, username, password }
  Response: { user, sessionToken }

GET /api/auth/me
  Headers: { Authorization: "Bearer {sessionToken}" }
  Response: { user }

POST /api/auth/logout
  Headers: { Authorization: "Bearer {sessionToken}" }
```

**Token storage:** Store the `sessionToken` in Expo SecureStore (encrypted on-device storage). Auto-attach it as a Bearer token on every API request.

**Session duration:** 30 days. Auto-refresh or re-prompt login on expiry.

**SSO for ecosystem apps:** When opening an ecosystem app in WebView, inject the session token via URL parameter or cookie so the user doesn't have to log in again:
```
https://app.tlid.io?sso_token={token}
```

### Biometric Auth
After initial login, offer Face ID / Touch ID / fingerprint for quick re-authentication:
```tsx
import * as LocalAuthentication from 'expo-local-authentication';

const result = await LocalAuthentication.authenticateAsync({
  promptMessage: 'Authenticate to Trust Layer',
  fallbackLabel: 'Use PIN',
});
```

---

## 7. ALL 32 ECOSYSTEM APPS

Each app needs an entry in the app directory. Here is the complete list with categories:

### Core Infrastructure
| App | Description | URL |
|-----|-------------|-----|
| Trust Layer | Layer 1 PoA Blockchain — 200K+ TPS, 400ms blocks | dwtl.io |
| TrustHome | Real estate agent super tool with Trust Layer-verified agent profiles, property listings, and blockchain-backed trust scores | trusthome.replit.app |
| TrustVault | Multi-chain wallet with multi-sig security | trustvault.replit.app |
| TLID.io | Blockchain domain names (.tlid identity) | tlid.io |
| THE VOID | Premium membership identity and ecosystem SSO | intothevoid.app |
| DWSC Studio | Development IDE for ecosystem builders | [portal]/studio |

### DeFi & Finance
| App | Description | URL |
|-----|-------------|-----|
| Guardian Screener | DEX screener with AI rug pull detection | [portal]/guardian-screener |
| TradeWorks AI | AI-powered trading intelligence and analysis | tradeworksai.io |
| StrikeAgent | Sentient AI trading bot with verified predictions | strikeagent.io |
| Pulse | Predictive market analytics powered by ML | darkwavepulse.com |

### Security
| App | Description | URL |
|-----|-------------|-----|
| TrustShield | Enterprise blockchain security monitoring | trustshield.tech |
| Guardian Scanner | AI agent verification across 13+ chains | [portal]/guardian |

### Gaming & Entertainment
| App | Description | URL |
|-----|-------------|-----|
| Chronicles | 3D life simulation across 13 historical epochs | yourlegacy.io |
| The Arcade | Provably fair blockchain games | darkwavegames.io |
| Bomber | 3D long driving golf game | bomber.tlid.io |

### Social & Community
| App | Description | URL |
|-----|-------------|-----|
| Signal Chat | Encrypted real-time messaging | [portal]/signal-chat |
| Academy | Crypto education and certification | [portal]/academy |

### Health & Lifestyle
| App | Description | URL |
|-----|-------------|-----|
| VedaSolus | AI holistic wellness (Ayurveda + TCM) | vedasolus.io |
| Verdara | AI outdoor recreation super-app | verdara.replit.app |
| Trust Golf | Premium golf companion with AI swing analysis | trustgolf.app |

### Enterprise & Business
| App | Description | URL |
|-----|-------------|-----|
| ORBIT Staffing OS | Blockchain HR, payroll, and workforce mgmt | orbitstaffing.io |
| Orby Commander | Venue and event operations command suite | getorby.io |

### Automotive
| App | Description | URL |
|-----|-------------|-----|
| GarageBot | Smart vehicle maintenance automation | garagebot.io |
| Lot Ops Pro | Autonomous auto lot management | lotopspro.io |
| TORQUE | Blockchain-verified auto marketplace | garagebot.io/torque |
| TL Driver Connect | Verified driver coordination and logistics | tldriverconnect.com |

### Services
| App | Description | URL |
|-----|-------------|-----|
| PaintPros | Professional painting service management | paintpros.io |
| Nashville Painting Professionals | Premier Nashville painting contractor | nashpaintpros.io |
| Arbora | Professional arborist business suite | verdara.replit.app/arbora |

### Food & Hospitality
| App | Description | URL |
|-----|-------------|-----|
| Happy Eats | Food truck ordering with zone-based batching | happyeats.app |
| Brew & Board Coffee | Coffee shop loyalty and community platform | brewandboard.coffee |

### Publishing
| App | Description | URL |
|-----|-------------|-----|
| Trust Book | Censorship-free ebook publishing, 70% royalties | [portal]/trust-book |

---

## 8. API ENDPOINTS THE APP NEEDS

All requests go to the Trust Layer backend. Base URL will be the production deployment URL.

### Auth
```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/me
POST   /api/auth/logout
```

### User Data
```
GET    /api/user/profile
GET    /api/user/balance          → { sig, shells, stSig }
GET    /api/user/transactions     → [{ id, type, amount, asset, txHash, createdAt }]
GET    /api/user/notifications
```

### Presale / Shells
```
POST   /api/shells/purchase       → { amount, paymentMethod }
GET    /api/presale/stats         → { totalSold, totalHolders, currentPrice }
```

### Ecosystem
```
GET    /api/ecosystem/apps        → [{ id, name, description, url, category, icon }]
GET    /api/ecosystem/news        → [{ id, title, body, createdAt }]
```

### Chat (WebSocket)
```
WSS    /ws/chat
Events: message, typing, presence, channel_join, channel_leave
```

### Guardian
```
POST   /api/guardian/scan         → { url } → { score, threats, details }
```

---

## 9. PUSH NOTIFICATIONS

Use Expo Notifications to register the device token with the backend:

```
POST /api/notifications/register
Body: { pushToken, platform: "ios" | "android" }
```

**Notification types:**
- Presale milestones (e.g., "50% of Shells sold!")
- New ecosystem app launches
- SIG/Shell balance changes
- Signal Chat messages
- Guardian security alerts
- Launch countdown milestones

---

## 10. TOKENOMICS REFERENCE

**Signal (SIG) is a NATIVE ASSET — not a token, not a cryptocurrency. It is the native currency of the Trust Layer blockchain, like ETH is to Ethereum or SOL is to Solana. NEVER call it a token.**

| Property | Value |
|----------|-------|
| Name | Signal |
| Symbol | SIG |
| Type | Native Asset |
| Total Supply | 1,000,000,000 SIG |
| Pre-launch Currency | Shells (1 Shell = $0.001, converts to SIG at launch) |
| In-game Currency | Echo (1 Echo = $0.0001, 10 Echoes = 1 Shell) |

**Allocation:**
- Treasury: 50% (500M SIG)
- Staking Rewards: 15% (150M SIG)
- Development & Team: 15% (150M SIG)
- Ecosystem Growth: 10% (100M SIG)
- Community Rewards: 10% (100M SIG)

---

## 11. LAUNCH DATE

**August 23, 2026** — Jason's 50th birthday. This is final. Never change it.

Tagline: **"One Year. One Vision. Launch Day."**

The app should display a real-time countdown to this date on the dashboard.

---

## 12. APP STORE LISTING COPY

### App Name
**Trust Layer — Blockchain Hub**

### Short Description (80 chars)
One chain. 32 apps. The complete blockchain ecosystem in your pocket.

### Full Description
Trust Layer is the most complete blockchain ecosystem ever built — 32 interconnected applications spanning DeFi, AI trading, security, gaming, publishing, and enterprise tools, all powered by a custom Layer 1 Proof-of-Authority blockchain doing 200K+ transactions per second.

With Trust Layer Hub, you get:

DASHBOARD — Your ecosystem at a glance. SIG balance, Shell balance, portfolio value, and real-time activity across all connected apps.

32 APPS — Browse the full ecosystem organized by category. DeFi trading tools, AI-powered market intelligence, blockchain security scanners, 3D gaming, censorship-free publishing, enterprise workforce management, and more. Launch any app with one tap.

WALLET — View your Signal (SIG) native asset balance, buy Shells (pre-launch currency), and track your complete transaction history with blockchain-verified records.

SIGNAL CHAT — Encrypted real-time messaging with blockchain-verified identities. Stay connected with the Trust Layer community.

GUARDIAN SECURITY — Scan any URL, smart contract, or AI agent for threats across 13+ blockchain networks.

Trust Layer launches August 23, 2026. Get in early. Build your position. Be part of the future of trust.

### Keywords
blockchain, crypto, defi, wallet, trading, ai, security, gaming, nft, web3

### Category
Finance (primary), Productivity (secondary)

### Content Rating
Everyone / 4+

---

## 13. FILE STRUCTURE

```
trust-layer-hub/
├── app/                          # Expo Router (file-based routing)
│   ├── (tabs)/                   # Tab navigator
│   │   ├── index.tsx             # Home / Dashboard
│   │   ├── explore.tsx           # App Directory
│   │   ├── wallet.tsx            # Wallet & Balances
│   │   ├── chat.tsx              # Signal Chat
│   │   └── profile.tsx           # User Profile
│   ├── app/[id].tsx              # App detail modal
│   ├── login.tsx                 # Login screen
│   ├── register.tsx              # Registration screen
│   └── _layout.tsx               # Root layout
├── components/
│   ├── GlassCard.tsx             # Glassmorphism card
│   ├── GradientText.tsx          # Gradient text component
│   ├── Skeleton.tsx              # Loading skeleton
│   ├── AppCard.tsx               # Ecosystem app card
│   ├── BalanceCard.tsx           # SIG/Shell balance display
│   ├── CountdownTimer.tsx        # Launch countdown
│   ├── NewsCard.tsx              # News feed item
│   ├── TransactionRow.tsx        # Transaction list item
│   └── BackgroundGlow.tsx        # Ambient glow orbs
├── hooks/
│   ├── useAuth.ts                # Authentication hook
│   ├── useBalance.ts             # Balance queries
│   ├── useEcosystemApps.ts       # App directory queries
│   └── useChat.ts                # WebSocket chat hook
├── lib/
│   ├── api.ts                    # API client with auth headers
│   ├── colors.ts                 # Theme color constants
│   ├── storage.ts                # SecureStore helpers
│   └── queryClient.ts            # TanStack Query setup
├── assets/
│   ├── app-icons/                # Icons for all 32 apps
│   └── images/                   # Marketing images
├── app.json                      # Expo config
├── eas.json                      # EAS Build config
└── package.json
```

---

## 14. BRANDING RULES

- **"Trust Layer"** for all ecosystem branding and user-facing text
- **"DarkWave Studios"** ONLY for company/legal entity (e.g., "© 2026 DarkWave Studios")
- **"The Arcade"** for the gaming portal (NOT "DarkWave Games")
- **"Academy"** for the education platform
- **"Chronicles"** for the life simulation game
- **"Signal Chat"** for the messaging platform
- **Signal (SIG)** is a NATIVE ASSET — never "token" or "cryptocurrency"
- Customer support email: **team@dwsc.io**
- No Replit branding anywhere in the app

---

## 15. THINGS TO AVOID

1. **Calling SIG a "token"** — it is a native asset
2. **Light mode** — dark theme only, no toggle
3. **Vertical card lists** — use horizontal carousels for 4+ same-type items
4. **Plain white cards** — everything uses GlassCard with glassmorphism
5. **Missing animations** — every screen transition and list entry should animate
6. **WebView for core screens** — Dashboard, Explore, Wallet, Profile, Login must be native
7. **Direct Stripe on iOS** — digital goods on iOS MUST use Apple IAP
8. **Link farm appearance** — the app must have real utility, not just a list of links
9. **Placeholder images** — every app card needs a real icon/image
10. **Changing the launch date** — August 23, 2026. Period.

---

## 16. BUILD SESSION PLAN

This is the execution plan. Follow it in order. Each task lists what to build, what files to create, and what "done" looks like.

### Phase 1: Project Scaffolding

#### T001: Initialize Expo Project
- **Blocked By**: []
- **Details**:
  - Run `npx create-expo-app trust-layer-hub --template blank-typescript`
  - Install all dependencies from Section 3 (NativeWind, Reanimated, Moti, expo-blur, expo-linear-gradient, expo-haptics, expo-secure-store, @tanstack/react-query, axios, react-native-webview, lucide-react-native, @react-native-masked-view/masked-view)
  - Configure NativeWind v4 with the dark theme color tokens from Section 4.1
  - Set up Expo Router file-based navigation in `app/` directory
  - Configure `app.json` with app name "Trust Layer", slug, scheme for deep linking, iOS/Android bundle IDs
  - Files: `package.json`, `app.json`, `tailwind.config.js`, `global.css`, `app/_layout.tsx`, `metro.config.js`, `babel.config.js`, `tsconfig.json`
  - Acceptance: App boots on simulator, shows blank dark screen, no errors

#### T002: Create Shared UI Components
- **Blocked By**: [T001]
- **Details**:
  - Build `GlassCard` exactly as specified in Section 4.2 (expo-blur + LinearGradient glow border)
  - Build `GradientText` using MaskedView + LinearGradient as in Section 4.5
  - Build `Skeleton` loading component as in Section 4.6
  - Build `BackgroundGlow` orb component as in Section 4.8
  - Build gradient `Button` component as in Section 4.9 (44px min touch target)
  - All components dark theme only
  - Files: `components/GlassCard.tsx`, `components/GradientText.tsx`, `components/Skeleton.tsx`, `components/BackgroundGlow.tsx`, `components/Button.tsx`
  - Acceptance: Each component renders correctly in isolation. GlassCard has visible blur and glow. Buttons have 44px+ touch targets.

#### T003: Create Theme & API Layer
- **Blocked By**: [T001]
- **Details**:
  - Create color constants file with all tokens from Section 4.1
  - Create API client with axios, auto-attach Bearer token from SecureStore
  - Create TanStack Query client with default stale/cache times
  - Create SecureStore helper (save/get/delete session token)
  - Files: `lib/colors.ts`, `lib/api.ts`, `lib/queryClient.ts`, `lib/storage.ts`
  - Acceptance: API client can make authenticated requests. Token persists across app restarts.

### Phase 2: Authentication

#### T004: Build Auth Screens & Hook
- **Blocked By**: [T002, T003]
- **Details**:
  - Login screen: email + password fields, gradient "Sign In" button, link to register
  - Register screen: email + username + password fields, gradient "Create Account" button
  - `useAuth` hook: login mutation, register mutation, logout, `useQuery` for `/api/auth/me`
  - On successful login, store sessionToken in SecureStore, redirect to home tab
  - On app launch, check SecureStore for token, auto-login if valid
  - Biometric auth option after first login (expo-local-authentication)
  - Files: `app/login.tsx`, `app/register.tsx`, `hooks/useAuth.ts`
  - Acceptance: Can register, login, persist session, auto-login on restart. Biometric prompt works.

### Phase 3: Tab Navigation & Core Screens

#### T005: Build Tab Layout
- **Blocked By**: [T004]
- **Details**:
  - 5-tab bottom navigator: Home, Explore, Wallet, Chat, Profile
  - Tab bar: dark background (#0c1224), cyan active icon, gray inactive
  - Icons from Lucide: Home, Search, Wallet, MessageCircle, User
  - Tab bar should have subtle top border (rgba(255,255,255,0.08))
  - Haptic feedback on tab press (expo-haptics)
  - Files: `app/(tabs)/_layout.tsx`
  - Acceptance: All 5 tabs render, switching works, haptic on press, correct icons/colors

#### T006: Build Home Dashboard
- **Blocked By**: [T002, T005]
- **Details**:
  - Welcome header with user name + Trust Layer ID
  - Balance card (GlassCard glow): SIG balance, Shell balance, fiat estimate
  - Quick actions row: Buy Shells, Send, Scan, Bridge — 4 icon buttons in a row
  - News carousel: horizontal ScrollView with snap, each card is GlassCard
  - Featured apps carousel: horizontal ScrollView, app cards with icon + name + description
  - Activity feed: last 5 transactions, vertical list with "See All" link
  - Launch countdown: real-time countdown to August 23, 2026 (America/Chicago timezone)
  - All sections use MotiView staggered fade-in animations
  - Files: `app/(tabs)/index.tsx`, `components/BalanceCard.tsx`, `components/CountdownTimer.tsx`, `components/NewsCard.tsx`
  - Acceptance: Dashboard renders with all sections. Countdown is accurate. Carousels scroll horizontally with snap. Data loads from API.

#### T007: Build Explore (App Directory)
- **Blocked By**: [T002, T005]
- **Details**:
  - Search bar at top (TextInput with search icon, dark background)
  - Category filter: horizontal ScrollView of pill buttons (All, Core, DeFi, Security, Gaming, AI, Social, Business, Health, Services)
  - App grid: 2-column FlatList, each cell is GlassCard with app icon, name, one-line description, category badge
  - All 32 apps from Section 7 with correct names, descriptions, URLs, categories
  - Tapping a card opens detail modal (`app/app/[id].tsx`) with full description + "Launch" button
  - Launch button opens URL in react-native-webview or Expo WebBrowser
  - Pass SSO token when launching ecosystem apps
  - MotiView staggered grid animation
  - Files: `app/(tabs)/explore.tsx`, `app/app/[id].tsx`, `components/AppCard.tsx`, `hooks/useEcosystemApps.ts`
  - Acceptance: All 32 apps show. Search filters by name. Category pills filter correctly. Tapping opens detail. Launch opens in-app browser with SSO.

#### T008: Build Wallet Screen
- **Blocked By**: [T002, T005]
- **Details**:
  - Balance hero: large SIG amount with gradient text, fiat estimate below
  - Shell balance card with "Buy Shells" CTA button
  - Portfolio breakdown: simple visual (pie chart or segmented bar) — SIG, stSIG, NFTs
  - Transaction history: FlatList of TransactionRow items (icon, description, amount, timestamp, tx hash)
  - "Buy Shells" flow: navigate to purchase screen with Shell tier options from Section 5.3
  - Note: On iOS, digital purchases must use Apple IAP. On Android, can use Stripe or Google Play Billing.
  - Files: `app/(tabs)/wallet.tsx`, `components/TransactionRow.tsx`, `hooks/useBalance.ts`
  - Acceptance: Balances display correctly. Transaction history loads and scrolls. Buy Shells flow starts.

#### T009: Build Chat Screen (Signal Chat)
- **Blocked By**: [T002, T005]
- **Details**:
  - Channel list: FlatList of channels (public channels + DMs)
  - Message view: ScrollView of messages with user avatar (colored circle + initial), username, timestamp, message text
  - Message input bar: TextInput + Send button, fixed at bottom
  - WebSocket connection to `wss://{baseUrl}/ws/chat`
  - Typing indicators: "User is typing..." text
  - Real-time message updates
  - Files: `app/(tabs)/chat.tsx`, `hooks/useChat.ts`
  - Acceptance: Can connect to chat, see messages in real-time, send messages, see typing indicators.

#### T010: Build Profile Screen
- **Blocked By**: [T002, T005]
- **Details**:
  - Profile header: avatar (colored circle), name, email, Trust Layer ID, member number
  - THE VOID membership status badge
  - Guardian Security Score display
  - Settings section: Notifications toggle, Security (PIN/biometrics), appearance preferences
  - Linked accounts: list of connected ecosystem apps
  - Sign Out button (clears SecureStore, redirects to login)
  - Files: `app/(tabs)/profile.tsx`
  - Acceptance: Profile data displays correctly. Sign out works. Settings toggles function.

### Phase 4: Polish & Store Prep

#### T011: Push Notifications
- **Blocked By**: [T005]
- **Details**:
  - Request notification permissions on first launch
  - Register Expo push token with backend: `POST /api/notifications/register`
  - Handle incoming notifications (navigate to relevant screen)
  - Files: `lib/notifications.ts`, update `app/_layout.tsx`
  - Acceptance: Push token registers with backend. Notifications appear when app is backgrounded.

#### T012: App Store Assets & Config
- **Blocked By**: [T006, T007, T008, T009, T010]
- **Details**:
  - `eas.json` config for EAS Build (development, preview, production profiles)
  - App icon: 1024x1024 Trust Layer logo on dark background
  - Splash screen: Trust Layer logo centered, #0c1224 background
  - App Store screenshots (can be generated from simulator)
  - Privacy policy URL (required for both stores)
  - App Store listing copy from Section 12
  - Files: `eas.json`, `assets/icon.png`, `assets/splash.png`, `assets/adaptive-icon.png`
  - Acceptance: `eas build --platform all` succeeds. App icon and splash screen render correctly.

---

## 17. API BASE URL

The Trust Layer backend is deployed at the production URL. The app should read this from an environment variable or config:

```typescript
// lib/api.ts
const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'https://your-deployment-url.replit.app';
```

The agent building this will need to set `EXPO_PUBLIC_API_URL` to the correct production deployment URL.

---

## 18. CRITICAL REMINDERS FOR THE BUILDING AGENT

1. **Signal (SIG) is a NATIVE ASSET.** Not a token. Not a cryptocurrency. It is the native currency of the Trust Layer blockchain. Like ETH to Ethereum. If you write the word "token" anywhere in the app referring to SIG, you have failed.

2. **Dark theme ONLY.** No light mode. No toggle. Background is #0c1224. Every screen. Every modal. Every component.

3. **GlassCard padding rule.** Padding goes INSIDE the card content (`<View style={{padding: 20}}>` inside the card), never on the GlassCard wrapper itself. The blur and glow border must extend to the edges.

4. **Horizontal carousels, not vertical lists.** When you have 4+ cards of the same type (apps, news, features), they go in a horizontal ScrollView with snap behavior. Vertical stacking of many same-type cards is forbidden.

5. **44px minimum touch targets.** Every button, every tab, every tappable element. Apple and Google both require this for accessibility.

6. **Animations on everything.** Every screen transition fades in. Every list uses staggered MotiView. Every card has a subtle scale on press. No static, lifeless screens.

7. **Launch date is August 23, 2026.** The countdown timer on the dashboard counts down to this exact date in CST (America/Chicago). This date cannot change. Tagline: "One Year. One Vision. Launch Day."

8. **No Replit branding.** This is white-labeled. The only company name that appears is "DarkWave Studios" in the copyright footer. Everything else says "Trust Layer."

9. **Apple IAP for digital goods on iOS.** If you're selling Shells (which are a digital currency), Apple requires you use their In-App Purchase system on iOS. You cannot use Stripe directly for digital goods on iOS. Android has more flexibility.

10. **This app must have REAL functionality.** Apple/Google reject apps that are just link directories. The dashboard, wallet, chat, and profile screens are genuinely functional — they pull real data, real balances, real messages. The app directory is ONE feature, not the entire app.

---

*This document is the complete specification for building the Trust Layer Hub mobile app. The agent receiving this should have everything needed to begin development without additional context.*
