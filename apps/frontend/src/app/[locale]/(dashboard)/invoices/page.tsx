//src/app/[locale]/(dashboard)/invoices/page.tsx

import {
  InvoicesDashboard,
  InvoicesDashboardSkeleton,
} from "@/features/invoices";

import { Suspense } from "react";

export default function InvoicesPage() {
  return (
    <Suspense fallback={<InvoicesDashboardSkeleton />}>
      <InvoicesDashboard />
    </Suspense>
  );
}
