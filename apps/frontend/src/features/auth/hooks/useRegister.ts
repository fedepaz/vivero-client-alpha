// apps/frontend/src/features/auth/hooks/useRegister.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { clientFetch } from "@/lib/api/client-fetch";
import { UserProfileDto } from "@vivero/shared";

interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  // Add other registration fields as needed
}

interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfileDto;
}

export const useRegister = () => {
  const { signIn } = useAuth();

  const mutation = useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: async (userData) => {
      const response = await clientFetch<RegisterResponse>("auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });
      return response;
    },
    onSuccess: (data) => {
      // Store refresh token
      localStorage.setItem("refreshToken", data.refreshToken);

      // Automatically sign in after registration
      signIn(data.accessToken, data.user);
    },
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });

  return {
    register: mutation.mutate,
    registerAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    reset: mutation.reset,
  };
};
