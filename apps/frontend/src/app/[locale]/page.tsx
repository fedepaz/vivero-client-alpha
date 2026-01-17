//src/app/[locale]/page.tsx

import { RootDashboard, RootDashboardSkeleton } from "@/features/dashboard";
import { Suspense } from "react";

interface DashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default function RootDashboardPage({}: DashboardPageProps) {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <Suspense fallback={<RootDashboardSkeleton />}>
        <RootDashboard />
      </Suspense>
    </div>
  );
}
