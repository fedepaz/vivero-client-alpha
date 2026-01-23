// apps/frontend/src/features/auth/hooks/useLogout.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { clientFetch } from "@/lib/api/client-fetch";
import { useAuthContext } from "../providers/AuthProvider";

export const useLogout = () => {
  const { signOut } = useAuthContext();

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
