//src/features/clients/components/clients-kpi.tsx
"use client";

import { KPICard } from "@/components/data-display/kpi-card";
import { Building2, TrendingUp, UserCheck, Users } from "lucide-react";

import { useClients } from "../hooks/hooks";

function ClientsKPI() {
  const t = "ClientKPIs";
  const { data: clients = [] } = useClients();
  const totalClients = clients.length;
  const activeClients = clients.filter(
    (client) => client.status === "active",
  ).length;
  const totalRevenue = clients.reduce(
    (acc, client) => acc + client.totalRevenue,
    0,
  );
  const prospects = clients.filter(
    (client) => client.status === "prospect",
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title={t("totalClients")}
        value={totalClients.toLocaleString()}
        description={t("inDatabase")}
        icon={Building2}
        trend={{ value: 6.5, label: t("fromLastMonth"), isPositive: true }}
      />
      <KPICard
        title={t("activeClients")}
        value={activeClients.toLocaleString()}
        description={t("prospects", { count: prospects })}
        icon={UserCheck}
      />
      <KPICard
        title={t("totalRevenue")}
        value={`€${(totalRevenue / 1000).toFixed(0)}k`}
        description={t("fromAllClients")}
        icon={TrendingUp}
        trend={{ value: 18.2, label: t("fromLastMonth"), isPositive: true }}
      />
      <KPICard
        title={t("newProspects")}
        value={prospects}
        description={t("potentialClients")}
        icon={Users}
      />
    </div>
  );
}

export default ClientsKPI;
