//src/app/(dashboard)/users/page.tsx

import { UsersDashboard, UsersDashboardSkeleton } from "@/features/users";
import { Suspense } from "react";

export default function UsersPage() {
  return (
    <Suspense fallback={<UsersDashboardSkeleton />}>
      <UsersDashboard />
    </Suspense>
  );
}
