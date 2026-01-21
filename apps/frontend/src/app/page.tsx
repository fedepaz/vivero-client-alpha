// src/app/page.tsx
"use client";

import { LoadingSpinner } from "@/components/common/loading-spinner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (token) {
      router.push("/");
    } else {
      router.push("/login");
    }
  }, [router]);

  return <LoadingSpinner />;
}
