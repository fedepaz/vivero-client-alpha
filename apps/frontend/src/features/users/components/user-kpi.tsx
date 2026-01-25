//src/features/users/components/user-kpi.tsx
"use client";

import { KPICard } from "@/components/data-display/kpi-card";
import { Users, UserCheck, UserX, Shield } from "lucide-react";

import { useUsers } from "../hooks/useUsers";

function UserKPIs() {
  const { data } = useUsers();
  const totalUsers = data?.length || 0;
  const activeUsers = data?.filter((u) => u.isActive).length || 0;
  const inactiveUsers = data?.filter((u) => !u.isActive).length || 0;
  const emailUsers = data?.filter((u) => u.email?.includes("@")).length || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="Total de Usuarios"
        value={totalUsers}
        description="en el sistema"
        icon={Users}
        trend={{ value: 5.0, label: "desde el mes pasado", isPositive: true }}
      />
      <KPICard title="Usuarios Activos" value={activeUsers} icon={UserCheck} />
      <KPICard
        title="Usuarios Inactivos"
        value={inactiveUsers}
        description="Necesitan atención"
        icon={UserX}
      />
      <KPICard
        title="Contactos"
        value={emailUsers}
        description="Con correo electrónico"
        icon={Shield}
      />
    </div>
  );
}

export default UserKPIs;
