import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider, 
  GithubAuthProvider,
  OAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyByHm_Zwo9NGZ3DyHtZ5_wCtHlLXcat23Q",
  authDomain: "darkwave-auth.firebaseapp.com",
  projectId: "darkwave-auth",
  storageBucket: "darkwave-auth.firebasestorage.app",
  messagingSenderId: "413074069912",
  appId: "1:413074069912:web:bc3ec850c2c4e15c2a55a5",
  measurementId: "G-G34FQ74WDJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await syncUserToBackend(result.user);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/popup-blocked') {
      await signInWithRedirect(auth, googleProvider);
    }
    throw error;
  }
}

export async function signInWithGithub() {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    await syncUserToBackend(result.user);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/popup-blocked') {
      await signInWithRedirect(auth, githubProvider);
    }
    throw error;
  }
}

export async function signInWithApple() {
  try {
    const result = await signInWithPopup(auth, appleProvider);
    await syncUserToBackend(result.user);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/popup-blocked') {
      await signInWithRedirect(auth, appleProvider);
    }
    throw error;
  }
}

export async function signOut() {
  await firebaseSignOut(auth);
  window.location.href = '/';
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function checkRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      await syncUserToBackend(result.user);
    }
    return result;
  } catch (error) {
    console.error("Redirect result error:", error);
    return null;
  }
}

async function syncUserToBackend(user: User) {
  try {
    const idToken = await user.getIdToken();
    await fetch('/api/auth/firebase-sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      })
    });
  } catch (error) {
    console.error("Failed to sync user to backend:", error);
  }
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}
