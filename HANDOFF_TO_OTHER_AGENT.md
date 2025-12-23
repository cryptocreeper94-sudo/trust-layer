# DarkWave Token (DWT) - Agent Handoff Document

## IMPORTANT: Token Implementation Location Changed

The DarkWave Token (DWT) is now implemented as the **native token** of the DarkWave Chain Layer 1 blockchain, NOT as a separate ERC-20 smart contract.

---

## What This Means

1. **No separate smart contract deployment needed** - DWT is built directly into the blockchain
2. **No need to deploy to Ethereum, Polygon, or any other chain** - DarkWave Chain is its own independent blockchain
3. **The DWT token contract specification at orbitstaffing.io is now reference documentation** - The actual token lives on DarkWave Chain

---

## Final DWT Token Specifications

| Property | Value |
|----------|-------|
| **Token Name** | DarkWave Token |
| **Symbol** | DWT |
| **Total Supply** | 100,000,000 DWT |
| **Decimals** | 18 |
| **Network** | DarkWave Chain (Layer 1) |
| **Chain ID** | 8453 |
| **Block Time** | 400ms |
| **Consensus** | Proof-of-Authority |

---

## Token Location

The 100 million DWT tokens are minted at blockchain genesis to the validator address. This is the "treasury" that can then distribute tokens to:
- Ecosystem grants and partnerships
- Community rewards and airdrops  
- Team allocations (with vesting)
- DAO treasury
- Liquidity pools

---

## Blockchain RPC Endpoints

The DarkWave Chain blockchain exposes these APIs:

```
GET  /chain           - Chain info (ID, name, height, symbol)
GET  /block/:height   - Get block by height
GET  /block/latest    - Get latest block
GET  /account/:addr   - Get account balance/nonce
POST /transaction     - Submit transaction
GET  /stats           - Network statistics
```

---

## What Still Needs to Be Built

1. **Wallet Integration** - Web wallet to send/receive DWT
2. **Block Explorer** - Visual interface for the web portal
3. **Multi-Node Network** - P2P networking for decentralization
4. **Staking System** - Implement the staking rewards (6%/9%/12% APY)
5. **Governance** - Voting system (1 DWT = 1 vote)

---

## Summary

**DO NOT** deploy a separate ERC-20 contract for DWT.

The DarkWave Token is now the native currency of the DarkWave Chain blockchain, similar to how:
- ETH is native to Ethereum
- SOL is native to Solana
- MATIC is native to Polygon

All DWT operations happen directly on DarkWave Chain.

---

*Generated: December 2024*
*Project: DarkWave Studios - DarkWave Chain*

---

## Firebase Authentication (All DarkWave Ecosystem Apps)

All DarkWave ecosystem apps share the same Firebase project for unified user authentication.

### Firebase Configuration

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyByHm_Zwo9NGZ3DyHtZ5_wCtHlLXcat23Q",
  authDomain: "darkwave-auth.firebaseapp.com",
  projectId: "darkwave-auth",
  storageBucket: "darkwave-auth.firebasestorage.app",
  messagingSenderId: "413074061912",
  appId: "1:413074061912:web:b70884d2e91d9a922a55a5",
  measurementId: "G-EL9LT61B28"
};
```

### Installation

```bash
npm install firebase
```

### Quick Start (Google + GitHub Sign-In)

```javascript
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyByHm_Zwo9NGZ3DyHtZ5_wCtHlLXcat23Q",
  authDomain: "darkwave-auth.firebaseapp.com",
  projectId: "darkwave-auth",
  storageBucket: "darkwave-auth.firebasestorage.app",
  messagingSenderId: "413074061912",
  appId: "1:413074061912:web:b70884d2e91d9a922a55a5",
  measurementId: "G-EL9LT61B28"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Google Sign-In
async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

// GitHub Sign-In
async function signInWithGitHub() {
  const result = await signInWithPopup(auth, githubProvider);
  return result.user;
}

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Signed in:", user.uid, user.email);
  } else {
    console.log("Signed out");
  }
});

// Sign out
async function handleSignOut() {
  await signOut(auth);
}
```

### React Native Installation

```bash
npm install @react-native-firebase/app @react-native-firebase/auth
```

### Important Notes

- The Firebase client config is **safe to expose** in client-side code
- All apps using this config share the same user accounts
- Add your app's domain to Firebase Console → Authentication → Settings → Authorized domains
- For backend sync, call your `/api/auth/firebase-sync` endpoint after sign-in
