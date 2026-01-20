// src/app/(dashboard)/clients/page.tsx

import { ClientsDashboard, ClientsDashboardSkeleton } from "@/features/clients";
import { Suspense } from "react";

export default function ClientsPage() {
  return (
    <Suspense fallback={<ClientsDashboardSkeleton />}>
      <ClientsDashboard />
    </Suspense>
  );
}
