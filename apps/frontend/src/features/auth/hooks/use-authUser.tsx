// apps/frontend/src/features/auth/hooks/use-authUser.tsx
"use client";

import { useQuery } from "@tanstack/react-query";

import { UserProfileDto } from "@vivero/shared";
import { useAuth } from "./useAuth";
import { clientFetch } from "@/lib/api/client-fetch";

// This is the key for the query cache
export const userProfileQueryKeys = {
  all: ["userProfile"] as const,
  me: () => [...userProfileQueryKeys.all, "me"] as const,
};

export const useAuthUserProfile = () => {
  const { isSignedIn, loading: authLoading } = useAuth();

  const {
    data: userProfile,
    isLoading: queryLoading,
    isError,
    isSuccess,
    ...rest
  } = useQuery<UserProfileDto>({
    queryKey: userProfileQueryKeys.me(),
    queryFn: () =>
      clientFetch<UserProfileDto>("auth/profile", { method: "GET" }),
    enabled: isSignedIn,
    retry: 1, // Retry once to account for transient network issues
  });

  // Determine if the database is unavailable
  const isLoading = authLoading || queryLoading;
  const isDatabaseUnavailable = isError;
  const isPendingPermissions = isSignedIn && isSuccess && !userProfile;

  if (userProfile) {
    console.log("userProfile", userProfile);
  }

  return {
    userProfile,
    isLoading,
    isError,
    isDatabaseUnavailable,
    isPendingPermissions,
    ...rest,
  };
};
