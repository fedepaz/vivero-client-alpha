// src/providers/query-client-provider.tsx

"use client";

import { AuthUserProfileProvider } from "@/features/auth/providers/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

interface Props {
  children: ReactNode;
}

export function ReactClientProvider({ children }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 60 * 1000 * 10, // 10 minutes
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <AuthUserProfileProvider>{children}</AuthUserProfileProvider>
    </QueryClientProvider>
  );
}
