import crypto from 'crypto';

const HUB_URL = 'https://orbitstaffing.io';
const APP_ID = process.env.DARKWAVE_API_KEY || '';
const API_SECRET = process.env.DARKWAVE_API_SECRET || '';

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

// Google Sign-In
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

// GitHub Sign-In  
export async function signInWithGitHub() {
  const result = await signInWithPopup(auth, githubProvider);
  return result.user;
}

// Auth State Listener
export function onAuthChange(callback: (user: any) => void) {
  return onAuthStateChanged(auth, callback);
}

// Sign Out
export async function handleSignOut() {
  await signOut(auth);
}

// INSTALLATION:
// npm install firebase
//
// IMPORTANT:
// - Add your app domain to Firebase Console > Authentication > Settings > Authorized domains
// - This config is safe to expose in client code (Firebase security model)
// - All apps using this config share the same user accounts
`
};

async function main() {
  console.log('Configured:', !!APP_ID && !!API_SECRET);
  
  if (!APP_ID || !API_SECRET) {
    console.log('Missing: DARKWAVE_API_KEY or DARKWAVE_API_SECRET');
    return;
  }

  const body = firebaseSnippet;
  const bodyStr = JSON.stringify(body);
  const timestamp = Date.now().toString();
  
  // Match hub's expected signature format: timestamp + body
  const payload = timestamp + bodyStr;
  const signature = crypto.createHmac('sha256', API_SECRET).update(payload).digest('hex');

  console.log('Pushing Firebase snippet to DarkWave Team Hub...');
  
  const response = await fetch(`${HUB_URL}/api/ecosystem/snippets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-DarkWave-App-ID': APP_ID,
      'X-DarkWave-Signature': signature,
      'X-DarkWave-Timestamp': timestamp
    },
    body: bodyStr
  });

  const result = await response.json();
  console.log('Response:', response.status, result);
}

main().catch(console.error);
