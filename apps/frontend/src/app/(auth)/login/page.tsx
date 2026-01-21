// src/app/(auth)/login/page.tsx

import { LoadingSpinner } from "@/components/common/loading-spinner";
import { LoginForm } from "@/features/auth/components/login-form";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginForm />
    </Suspense>
  );
}
