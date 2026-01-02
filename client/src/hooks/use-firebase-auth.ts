import { useState, useEffect } from "react";
import { type User } from "firebase/auth";
import { onAuthChange, checkRedirectResult, signOut, auth } from "@/lib/firebase";

export async function getAuthToken(): Promise<string | null> {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  return currentUser.getIdToken();
}

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkRedirectResult();
    
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    signOut,
    displayName: user?.displayName || user?.email?.split('@')[0] || 'User',
    email: user?.email,
    photoURL: user?.photoURL,
    getAuthToken,
  };
}
