// apps/frontend/src/features/auth/hooks/useLogout.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { clientFetch } from "@/lib/api/client-fetch";

export const useLogout = () => {
  const { signOut } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      // Call backend logout endpoint
      try {
        await clientFetch("auth/logout", {
          method: "POST",
        });
      } catch (error) {
        // Even if backend call fails, still logout locally
        console.error("Backend logout failed:", error);
      }
    },
    onSuccess: () => {
      // Clear refresh token
      localStorage.removeItem("refreshToken");

      // Clear all cached queries
      queryClient.clear();

      // Update auth state
      signOut();
    },
  });

  return {
    logout: mutation.mutate,
    logoutAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};
