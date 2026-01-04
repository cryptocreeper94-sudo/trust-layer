import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface User {
  id: string;
  email: string | null;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  username: string | null;
}

export async function getAuthToken(): Promise<string | null> {
  return null;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const response = await fetch("/api/auth/me");
      const data = await response.json();
      if (!data.user) return null;
      return {
        id: data.user.id,
        email: data.user.email,
        displayName: data.user.displayName || data.user.username,
        firstName: data.user.displayName?.split(' ')[0] || data.user.username || null,
        lastName: data.user.displayName?.split(' ').slice(1).join(' ') || null,
        profileImageUrl: data.user.profileImageUrl,
        username: data.user.username || data.user.email?.split('@')[0] || null,
      } as User;
    },
    staleTime: 30000,
  });

  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      queryClient.clear();
      window.location.href = "/";
    } finally {
      setIsLoggingOut(false);
    }
  }, [queryClient]);

  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user,
    logout,
    isLoggingOut,
    getAuthToken,
    refetch,
  };
}
