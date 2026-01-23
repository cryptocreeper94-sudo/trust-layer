import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  githubProvider,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  type FirebaseUser
} from "@/lib/firebase";

interface User {
  id: string;
  email: string | null;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  username: string | null;
  firebaseUser: FirebaseUser;
}

interface AuthError {
  code: string;
  message: string;
}

function getErrorMessage(error: any): string {
  const code = error?.code || "";
  switch (code) {
    case "auth/invalid-email":
      return "Invalid email address";
    case "auth/user-disabled":
      return "This account has been disabled";
    case "auth/user-not-found":
      return "No account found with this email";
    case "auth/wrong-password":
      return "Incorrect password";
    case "auth/email-already-in-use":
      return "An account already exists with this email";
    case "auth/weak-password":
      return "Password should be at least 6 characters";
    case "auth/popup-closed-by-user":
      return "Sign-in was cancelled";
    case "auth/network-request-failed":
      return "Network error. Please check your connection";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later";
    case "auth/invalid-credential":
      return "Invalid email or password";
    default:
      return error?.message || "An error occurred";
  }
}

function mapFirebaseUser(firebaseUser: FirebaseUser): User {
  const displayName = firebaseUser.displayName || firebaseUser.email?.split("@")[0] || null;
  const nameParts = displayName?.split(" ") || [];
  
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    displayName,
    firstName: nameParts[0] || null,
    lastName: nameParts.slice(1).join(" ") || null,
    profileImageUrl: firebaseUser.photoURL,
    username: firebaseUser.email?.split("@")[0] || null,
    firebaseUser,
  };
}

export function useFirebaseAuth() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const mappedUser = mapFirebaseUser(firebaseUser);
        setUser(mappedUser);
        
        try {
          const idToken = await firebaseUser.getIdToken();
          await fetch("/api/auth/firebase-sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          });
        } catch (err) {
          console.warn("Failed to sync with backend:", err);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      // Use local API for email/password login (more reliable than Firebase)
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }
      
      // Create a simple user object from the API response
      const userData: User = {
        id: data.user.id,
        email: data.user.email,
        displayName: data.user.firstName || data.user.email?.split("@")[0] || null,
        firstName: data.user.firstName || null,
        lastName: data.user.lastName || null,
        profileImageUrl: data.user.profileImageUrl || null,
        username: data.user.username || data.user.email?.split("@")[0] || null,
        firebaseUser: null as any, // No Firebase user for local auth
      };
      
      setUser(userData);
      return { success: true, user: userData };
    } catch (err: any) {
      const message = err.message || "Login failed";
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, displayName?: string) => {
    setError(null);
    try {
      // Use local API for registration (more reliable than Firebase)
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName: displayName }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }
      
      // Create a simple user object from the API response
      const userData: User = {
        id: data.user.id,
        email: data.user.email,
        displayName: data.user.firstName || data.user.email?.split("@")[0] || null,
        firstName: data.user.firstName || null,
        lastName: data.user.lastName || null,
        profileImageUrl: data.user.profileImageUrl || null,
        username: data.user.username || data.user.email?.split("@")[0] || null,
        firebaseUser: null as any, // No Firebase user for local auth
      };
      
      setUser(userData);
      return { success: true, user: userData };
    } catch (err: any) {
      const message = err.message || "Registration failed";
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return { success: true, user: mapFirebaseUser(result.user) };
    } catch (err: any) {
      const message = getErrorMessage(err);
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const loginWithGithub = useCallback(async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, githubProvider);
      return { success: true, user: mapFirebaseUser(result.user) };
    } catch (err: any) {
      const message = getErrorMessage(err);
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await signOut(auth);
      await fetch("/api/auth/logout", { method: "POST" });
      queryClient.clear();
      setUser(null);
    } finally {
      setIsLoggingOut(false);
    }
  }, [queryClient]);

  const resetPassword = useCallback(async (email: string) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (err: any) {
      const message = getErrorMessage(err);
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const getAuthToken = useCallback(async (): Promise<string | null> => {
    if (!user?.firebaseUser) return null;
    try {
      return await user.firebaseUser.getIdToken();
    } catch {
      return null;
    }
  }, [user]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    clearError: () => setError(null),
    login,
    signup,
    loginWithGoogle,
    loginWithGithub,
    logout,
    isLoggingOut,
    resetPassword,
    getAuthToken,
  };
}
