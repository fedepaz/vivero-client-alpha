// apps/frontend/src/features/auth/hooks/use-authUser.tsx
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserProfileDto } from "@vivero/shared";
import { useAuth } from "./useAuth";
import { ApiError, clientFetch } from "@/lib/api/client-fetch";
import { useEffect } from "react";

// This is the key for the query cache
export const userProfileQueryKeys = {
  all: ["userProfile"] as const,
  me: () => [...userProfileQueryKeys.all, "me"] as const,
};

export const useAuthUserProfile = () => {
  const { isSignedIn, loading: authLoading, signOut } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery<UserProfileDto>({
    queryKey: userProfileQueryKeys.me(),
    queryFn: () => clientFetch<UserProfileDto>("users/me", { method: "GET" }),
    enabled: isSignedIn,
    retry: 1, // Retry once to account for transient network issues
  });

  useEffect(() => {
    if (query.isError) {
      const error = query.error;
      if (
        error instanceof ApiError &&
        (error.status === 401 || error.status === 403)
      ) {
        console.warn("Token expired, signing out");
        signOut();
        queryClient.resetQueries({ queryKey: userProfileQueryKeys.me() });
      }
    }
  }, [query.isError, query.error, signOut, queryClient]);

  // Determine if the database is unavailable
  const isLoading = authLoading || query.isLoading;
  const isDatabaseUnavailable =
    query.isError &&
    !(
      query.error instanceof ApiError &&
      (query.error.status === 401 || query.error.status === 403)
    );
  const isPendingPermissions = isSignedIn && query.isSuccess && !query.data;
  console.log("Tokens and Profile", isSignedIn, isLoading, query.data);

  return {
    userProfile: query.data,
    isLoading,
    isError: query.isError,
    isDatabaseUnavailable,
    isPendingPermissions,
  };
};
