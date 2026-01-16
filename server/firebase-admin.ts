/**
 * Firebase Admin SDK initialization for secure token verification
 * Uses FIREBASE_SERVICE_ACCOUNT secret for authentication
 */

import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";

let adminApp: App | null = null;
let adminAuth: Auth | null = null;

/**
 * Initialize Firebase Admin SDK
 * Returns null if service account is not configured
 */
function initializeFirebaseAdmin(): App | null {
  // Check if already initialized
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return existingApps[0];
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountJson) {
    console.warn("[Firebase Admin] FIREBASE_SERVICE_ACCOUNT not configured - token verification disabled");
    return null;
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountJson);
    const app = initializeApp({
      credential: cert(serviceAccount),
    });
    console.log("[Firebase Admin] Initialized successfully");
    return app;
  } catch (error) {
    console.error("[Firebase Admin] Failed to initialize:", error);
    return null;
  }
}

/**
 * Get Firebase Admin Auth instance
 * Returns null if Firebase Admin is not configured
 */
export function getFirebaseAdminAuth(): Auth | null {
  if (adminAuth) return adminAuth;
  
  if (!adminApp) {
    adminApp = initializeFirebaseAdmin();
  }
  
  if (adminApp) {
    adminAuth = getAuth(adminApp);
  }
  
  return adminAuth;
}

/**
 * Verify a Firebase ID token
 * Returns the decoded token if valid, null otherwise
 */
export async function verifyFirebaseIdToken(idToken: string): Promise<{
  uid: string;
  email?: string;
  email_verified?: boolean;
} | null> {
  const auth = getFirebaseAdminAuth();
  if (!auth) {
    return null;
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken, true);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      email_verified: decodedToken.email_verified,
    };
  } catch (error: any) {
    // Don't log expired tokens as errors - they're expected
    if (error.code !== "auth/id-token-expired") {
      console.warn("[Firebase Admin] Token verification failed:", error.code || error.message);
    }
    return null;
  }
}

/**
 * Check if Firebase Admin is properly configured
 */
export function isFirebaseAdminConfigured(): boolean {
  return getFirebaseAdminAuth() !== null;
}
