import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface User {
  id: string;
  email: string | null;
  displayName: string | null;
  username: string | null;
  profileImageUrl: string | null;
}

export function useSimpleAuth() {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      const response = await fetch("/api/auth/me");
      const data = await response.json();
      return data.user as User | null;
    },
    staleTime: 30000,
  });

  const login = useCallback(async (email: string, password: string, rememberMe?: boolean) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, rememberMe }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Login failed");
    }
    await refetch();
    return result;
  }, [refetch]);

  const register = useCallback(async (email: string, password: string, displayName?: string, rememberMe?: boolean) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, displayName, rememberMe }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Registration failed");
    }
    await refetch();
    return result;
  }, [refetch]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    queryClient.setQueryData(["auth-session"], null);
    window.location.href = "/";
  }, [queryClient]);

  return {
    user: data,
    loading: isLoading,
    isAuthenticated: !!data,
    displayName: data?.displayName || data?.email?.split("@")[0] || "User",
    email: data?.email,
    photoURL: data?.profileImageUrl,
    login,
    register,
    logout,
    refetch,
  };
}
