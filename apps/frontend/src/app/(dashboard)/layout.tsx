//src/app/(dashboard)/layout.tsx

import type React from "react";
import { Suspense } from "react";

import { DesktopSidebar } from "@/components/layout/desktop-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";

import ComingSoonPage from "@/components/common/coming-soon";
import { DashboardProtectedLayout } from "@/components/common/dashboard-protected-layout";
import { RootDashboardSkeleton } from "@/features/dashboard";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true") {
    return <ComingSoonPage />;
  }

  return (
    <Suspense fallback={<RootDashboardSkeleton />}>
      <DashboardProtectedLayout>
        <div className="flex h-screen overflow-hidden">
          <DesktopSidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <DashboardHeader />
            <main className="flex-1 overflow-auto pb-16 md:pb-0">
              <div className="mx-auto w-full max-w-[1600px] px-2 py-8 space-y-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </DashboardProtectedLayout>
    </Suspense>
  );
}
