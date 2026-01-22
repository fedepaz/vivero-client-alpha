// src/components/common/dashboard-protected-layout.tsx
"use client";

import { useAuthUserProfileContext } from "@/features/auth/providers/AuthProvider";
import { LoadingSpinner } from "./loading-spinner";
import { DatabaseUnavailablePage } from "./database-unavailable";
import { PendingPermissionsPage } from "./pending-permissions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface DashboardProtectedLayoutProps {
  children: React.ReactNode;
}

export function DashboardProtectedLayout({
  children,
}: DashboardProtectedLayoutProps) {
  const { isSignedIn, loading: authLoading } = useAuth();

  const router = useRouter();

  const {
    userProfile,
    isLoading: profileLoading,
    isDatabaseUnavailable,
    isPendingPermissions,
  } = useAuthUserProfileContext();
  useEffect(() => {
    if (!authLoading && !isSignedIn) {
      router.replace("/login");
    }
  }, [authLoading, isSignedIn, router]);

  if (profileLoading) {
    return <LoadingSpinner />;
  }
  // 2. Handle cases where the query returned an error indicating database unavailability
  if (isDatabaseUnavailable) {
    return <DatabaseUnavailablePage />;
  }

  // 3. Handle pending permissions scenario
  // This state implies the user is authenticated (as per useUserProfile's internal logic)
  // but their profile data suggests they are awaiting permissions.
  if (isPendingPermissions) {
    return <PendingPermissionsPage />;
  }

  // 4. User is signed in, profile fetched, and has permissions

  if (userProfile) {
    return <>{children}</>;
  }

  // Generic catch-all for any other unforeseen state
  return <LoadingSpinner />;
}
