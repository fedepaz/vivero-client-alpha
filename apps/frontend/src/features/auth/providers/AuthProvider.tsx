// src/features/auth/providers/AuthProvider.tsx
"use client";

import { createContext, useContext } from "react";
import { useAuthUserProfile } from "../hooks/use-authUser";
import { useAuth } from "../hooks/useAuth";
import { AuthResponseDto, UserProfileDto } from "@vivero/shared";

type AuthContextType = {
  userProfile: UserProfileDto | undefined;
  isLoading: boolean;
  isError: boolean;
  isDatabaseUnavailable: boolean;
  isPendingPermissions: boolean;
  isLoginComplete: boolean;

  isSignedIn: boolean;
  loading: boolean;
  signIn: (accessToken: string, user: AuthResponseDto["user"]) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const profile = useAuthUserProfile();

  const isLoginComplete = auth.isSignedIn && profile.userProfile !== undefined;

  const value = {
    isSignedIn: auth.isSignedIn,
    loading: auth.loading,
    signIn: auth.signIn,
    signOut: auth.signOut,
    isLoginComplete,
    userProfile: profile.userProfile,
    isLoading: profile.isLoading,
    isError: profile.isError,
    isDatabaseUnavailable: profile.isDatabaseUnavailable,
    isPendingPermissions: profile.isPendingPermissions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
