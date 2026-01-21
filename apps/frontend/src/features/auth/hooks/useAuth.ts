// src/features/auth/hooks/useAuth.ts
"use client";

import { UserProfileDto } from "@vivero/shared";
import { useEffect, useState } from "react";

interface AuthState {
  accessToken: string | null;
  user: UserProfileDto | null;
  isSignedIn: boolean;
}

const TOKEN_KEY = "accessToken";
const USER_KEY = "userProfile";

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    accessToken: null,
    user: null,
    isSignedIn: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const user = localStorage.getItem(USER_KEY);
      const parsedUser = user ? JSON.parse(user) : null;

      setAuthState({
        accessToken: token,
        user: parsedUser,
        isSignedIn: !!token && !!parsedUser,
      });
    } catch (error) {
      console.error("Error loading auth state:", error);
      signOut();
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = async (accessToken: string, user: UserProfileDto) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setAuthState({
      accessToken,
      user,
      isSignedIn: true,
    });
  };

  const signOut = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAuthState({
      accessToken: null,
      user: null,
      isSignedIn: false,
    });
  };

  return {
    ...authState,
    loading,
    signIn,
    signOut,
  };
}
