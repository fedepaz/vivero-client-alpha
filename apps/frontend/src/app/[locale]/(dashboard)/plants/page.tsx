//src/app/[locale]/(dashboard)/plants/page.tsx

import { PlantsDashboard, PlantsDashboardSkeleton } from "@/features/plants";
import { Suspense } from "react";

export default function PlantsPage() {
  return (
    <Suspense fallback={<PlantsDashboardSkeleton />}>
      <PlantsDashboard />
    </Suspense>
  );
}
