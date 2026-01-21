// src/app/(auth)/register/page.tsx

import { LoadingSpinner } from "@/components/common/loading-spinner";
import { RegisterForm } from "@/features/auth/components/register-form";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RegisterForm />
    </Suspense>
  );
}
