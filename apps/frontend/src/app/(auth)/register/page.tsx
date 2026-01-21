// src/app/(auth)/register/page.tsx

import { AuthSkeleton } from "@/features/auth";
import { RegisterForm } from "@/features/auth/components/register-form";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <RegisterForm />
    </Suspense>
  );
}
