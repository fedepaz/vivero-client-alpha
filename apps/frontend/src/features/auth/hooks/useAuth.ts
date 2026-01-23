// src/features/auth/hooks/useAuth.ts
"use client";

import { AuthResponseDto } from "@vivero/shared";
import { useCallback, useEffect, useState } from "react";

interface AuthState {
  accessToken: string | null;
  user: AuthResponseDto["user"] | null;
  isSignedIn: boolean;
}

const TOKEN_KEY = "accessToken";
const USER_KEY = "userProfile";
const AUTH_EVENT = "auth-state-change";

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    accessToken: null,
    user: null,
    isSignedIn: false,
  });
  const [loading, setLoading] = useState(true);

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAuthState({
      accessToken: null,
      user: null,
      isSignedIn: false,
    });
    window.dispatchEvent(new Event(AUTH_EVENT));
  }, []);

  const loadFromStorage = useCallback(() => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const user = localStorage.getItem(USER_KEY);
      const parsedUser = user ? JSON.parse(user) : null;

      setAuthState({
        accessToken: token,
        user: parsedUser,
        isSignedIn: !!token,
      });
    } catch (error) {
      console.error("Error loading auth state:", error);
      signOut();
    } finally {
      setLoading(false);
    }
  }, [signOut]);

  useEffect(() => {
    loadFromStorage();
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === TOKEN_KEY || e.key === USER_KEY) {
        loadFromStorage();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadFromStorage]);

  const signIn = useCallback(
    async (accessToken: string, user: AuthResponseDto["user"]) => {
      localStorage.setItem(TOKEN_KEY, accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      setAuthState({
        accessToken,
        user,
        isSignedIn: true,
      });
      window.dispatchEvent(new Event(AUTH_EVENT));
    },
    [],
  );

  useEffect(() => {
    const handleAuthChange = () => loadFromStorage();
    window.addEventListener(AUTH_EVENT, handleAuthChange);
    return () => window.removeEventListener(AUTH_EVENT, handleAuthChange);
  }, [loadFromStorage]);

  console.log("AuthState", authState);

  return {
    ...authState,
    loading,
    signIn,
    signOut,
  };
}
