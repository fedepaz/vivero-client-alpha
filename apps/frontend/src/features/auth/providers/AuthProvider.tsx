// src/features/auth/providers/AuthProvider.tsx
"use client";

import { createContext, useContext, useEffect } from "react";
import {
  useAuthUserProfile,
  userProfileQueryKeys,
} from "../hooks/use-authUser";
import { useAuth } from "../hooks/useAuth";
import {
  AuthResponseDto,
  UserPermissions,
  UserProfileDto,
} from "@vivero/shared";
import { permissionsQueryKeys, usePermissions } from "../hooks/use-permissions";
import { useQueryClient } from "@tanstack/react-query";

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
  permissions: UserPermissions;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (auth.isSignedIn) {
      queryClient.invalidateQueries({ queryKey: userProfileQueryKeys.me() });
      queryClient.invalidateQueries({ queryKey: permissionsQueryKeys.me() });
    } else {
      queryClient.removeQueries({ queryKey: userProfileQueryKeys.me() });
      queryClient.removeQueries({ queryKey: permissionsQueryKeys.me() });
    }
  }, [auth.isSignedIn, queryClient]);

  const profile = useAuthUserProfile();
  const permissions = usePermissions();
  // Detect pending permissions
  const isPendingPermissions =
    auth.isSignedIn &&
    permissions.isSuccess &&
    Object.keys(permissions.data || {}).length === 0;

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
    isPendingPermissions,
    permissions: permissions.data || {},
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
