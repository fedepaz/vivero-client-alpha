//src/features/users/components/user-kpi.tsx
"use client";

import { KPICard } from "@/components/data-display/kpi-card";
import { Users, UserCheck, UserX, Shield } from "lucide-react";

import { useUsers } from "../hooks/hooks";

function UserKPIs() {
  const t = "UserKPIs";
  const { data: mockUsers = [] } = useUsers();
  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter((u) => u.status === "active").length;
  const inactiveUsers = mockUsers.filter((u) => u.status === "inactive").length;
  const adminUsers = mockUsers.filter((u) => u.role === "admin").length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title={t("totalUsers")}
        value={totalUsers}
        description={t("inSystem")}
        icon={Users}
        trend={{ value: 5.0, label: t("fromLastMonth"), isPositive: true }}
      />
      <KPICard title={t("activeUsers")} value={activeUsers} icon={UserCheck} />
      <KPICard
        title={t("newUsersToday")}
        value={inactiveUsers}
        description={t("needAttention")}
        icon={UserX}
      />
      <KPICard
        title={t("administrators")}
        value={adminUsers}
        description={t("fullAccess")}
        icon={Shield}
      />
    </div>
  );
}

export default UserKPIs;
