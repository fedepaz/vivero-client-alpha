// src/providers/app-providers.tsx
"use client";

import { ReactClientProvider } from "./query-client-provider";
import { ThemeProvider } from "./theme-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReactClientProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </ReactClientProvider>
  );
}
