//src/app/(auth)/layout.tsx

import { AuthSkeleton } from "@/features/auth";
import { Suspense } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </Suspense>
  );
}
