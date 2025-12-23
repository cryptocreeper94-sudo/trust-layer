import crypto from 'crypto';

const HUB_URL = 'https://orbitstaffing.io';
const APP_ID = process.env.DARKWAVE_CHAIN_HUB_API_KEY || '';
const API_SECRET = process.env.DARKWAVE_CHAIN_HUB_API_SECRET || '';

const firebaseSnippet = {
  title: "firebase-auth-config",
  language: "javascript",
  category: "authentication",
  description: "Firebase Authentication configuration for all DarkWave ecosystem apps. Use this shared config for Google and GitHub sign-in.",
  code: `// DarkWave Ecosystem - Firebase Authentication
// All DarkWave apps share this Firebase project for unified user accounts

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
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signInWithGitHub() {
  const result = await signInWithPopup(auth, githubProvider);
  return result.user;
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function handleSignOut() {
  await signOut(auth);
}

// INSTALLATION: npm install firebase
// Add your domain to Firebase Console > Authentication > Authorized domains
`
};

async function tryAllAuthMethods() {
  const bodyStr = JSON.stringify(firebaseSnippet);
  const timestamp = Date.now().toString();
  
  console.log('APP_ID:', APP_ID ? APP_ID.substring(0, 25) + '...' : 'MISSING');
  console.log('API_SECRET:', API_SECRET ? 'SET' : 'MISSING');
  
  // Method 1: X-API-Key headers with method:path:timestamp:body signature
  console.log('\n--- Method 1: ecosystem-client format ---');
  const payload1 = `POST:/api/ecosystem/snippets:${timestamp}:${bodyStr}`;
  const sig1 = crypto.createHmac('sha256', API_SECRET).update(payload1).digest('hex');
  
  let res = await fetch(`${HUB_URL}/api/ecosystem/snippets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': APP_ID,
      'X-API-Secret': sig1,
      'X-Timestamp': timestamp
    },
    body: bodyStr
  });
  console.log('Method 1:', res.status, await res.json());

  // Method 2: X-DarkWave headers with timestamp+body signature
  console.log('\n--- Method 2: hub documentation format ---');
  const payload2 = timestamp + bodyStr;
  const sig2 = crypto.createHmac('sha256', API_SECRET).update(payload2).digest('hex');
  
  res = await fetch(`${HUB_URL}/api/ecosystem/snippets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-DarkWave-App-ID': APP_ID,
      'X-DarkWave-Signature': sig2,
      'X-DarkWave-Timestamp': timestamp
    },
    body: bodyStr
  });
  console.log('Method 2:', res.status, await res.json());

  // Method 3: Authorization Bearer token
  console.log('\n--- Method 3: Bearer token ---');
  res = await fetch(`${HUB_URL}/api/ecosystem/snippets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_SECRET}`
    },
    body: bodyStr
  });
  console.log('Method 3:', res.status, await res.json());

  // Method 4: X-API-Key with raw secret (no HMAC)
  console.log('\n--- Method 4: Raw secret ---');
  res = await fetch(`${HUB_URL}/api/ecosystem/snippets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': APP_ID,
      'X-API-Secret': API_SECRET
    },
    body: bodyStr
  });
  console.log('Method 4:', res.status, await res.json());
}

tryAllAuthMethods().catch(console.error);
