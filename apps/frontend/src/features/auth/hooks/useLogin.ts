// src/features/auth/hooks/useLogin.ts
"use client";

import { useMutation } from "@tanstack/react-query";

import { clientFetch } from "@/lib/api/client-fetch";
import { LoginAuthDto, AuthResponseDto } from "@vivero/shared";
import { useAuthContext } from "../providers/AuthProvider";

export const useLogin = () => {
  const { signIn } = useAuthContext();

  const mutation = useMutation<AuthResponseDto, Error, LoginAuthDto>({
    mutationFn: async (credentials) => {
      const response = await clientFetch<AuthResponseDto>("auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      console.log("Login Response", response);
      return response;
    },
    onSuccess: (data) => {
      console.log("onSuccess", data);
      // Store refresh token
      localStorage.setItem("refreshToken", data.refreshToken);

      // Update auth state via useAuth
      signIn(data.accessToken, data.user);
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  return {
    login: mutation.mutate,
    loginAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    reset: mutation.reset,
  };
};
