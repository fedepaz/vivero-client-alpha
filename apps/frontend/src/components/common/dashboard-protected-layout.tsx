// src/components/common/dashboard-protected-layout.tsx
"use client";

import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { LoadingSpinner } from "./loading-spinner";
import { DatabaseUnavailablePage } from "./database-unavailable";
import { PendingPermissionsPage } from "./pending-permissions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface DashboardProtectedLayoutProps {
  children: React.ReactNode;
}

export function DashboardProtectedLayout({
  children,
}: DashboardProtectedLayoutProps) {
  const router = useRouter();

  const {
    isSignedIn,
    loading: authLoading,
    userProfile,
    isLoading: profileLoading,
    isDatabaseUnavailable,
    isPendingPermissions,
  } = useAuthContext();

  useEffect(() => {
    if (!authLoading && !isSignedIn) {
      router.replace("/login");
    }
  }, [authLoading, isSignedIn, router]);

  useEffect(() => {
    if (isSignedIn && userProfile) {
    }
  }, [isSignedIn, userProfile]);

  if (profileLoading || authLoading) {
    return <LoadingSpinner />;
  }

  if (!isSignedIn) {
    return <LoadingSpinner />;
  }

  if (isDatabaseUnavailable) {
    return <DatabaseUnavailablePage />;
  }

  if (isPendingPermissions) {
    return <PendingPermissionsPage />;
  }

  if (!userProfile) {
    return <LoadingSpinner />;
  }
  return <>{children}</>;
}
