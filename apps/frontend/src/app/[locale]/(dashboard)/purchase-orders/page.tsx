//src/app/[locale]/(dashboard)/purchase-orders/page.tsx

import {
  PurchaseOrdersDashboard,
  PurchaseOrdersDashboardSkeleton,
} from "@/features/purchase-orders";
import { Suspense } from "react";

export default function PurchaseOrdersPage() {
  return (
    <Suspense fallback={<PurchaseOrdersDashboardSkeleton />}>
      <PurchaseOrdersDashboard />
    </Suspense>
  );
}
