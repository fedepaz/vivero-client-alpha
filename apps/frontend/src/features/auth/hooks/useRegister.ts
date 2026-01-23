// apps/frontend/src/features/auth/hooks/useRegister.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { clientFetch } from "@/lib/api/client-fetch";
import { AuthResponseDto, RegisterAuthDto } from "@vivero/shared";
import { useAuthContext } from "../providers/AuthProvider";

export const useRegister = () => {
  const { signIn } = useAuthContext();

  const mutation = useMutation<AuthResponseDto, Error, RegisterAuthDto>({
    mutationFn: async (userData) => {
      const response = await clientFetch<AuthResponseDto>("auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });
      return response;
    },
    onSuccess: (data) => {
      // Store refresh token
      localStorage.setItem("refreshToken", data.refreshToken);

      // Automatically sign in after registration
      signIn(data.accessToken, data);
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
