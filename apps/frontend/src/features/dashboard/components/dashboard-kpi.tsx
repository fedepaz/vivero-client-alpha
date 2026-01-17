//src/features/dashboard/components/dashboard-kpi.tsx

import { KPICard } from "@/components/data-display/kpi-card";
import { useDashboardKPIs } from "../hooks/hooks";
import { ShoppingCart, Sprout, TrendingUp, Users } from "lucide-react";

function DashboardKPI() {
  const t = "DashboardKPIs";
  const { data: kpi } = useDashboardKPIs();
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title={t("totalPlants")}
        value={kpi?.totalPlants}
        description={t("totalPlantsDescription")}
        icon={Sprout}
        trend={{ value: 12.5, label: t("fromLastMonth"), isPositive: true }}
      />
      <KPICard
        title={t("activePlants")}
        value={kpi?.activePlants}
        description={t("activePlantsDescription")}
        icon={Users}
        trend={{ value: 8.2, label: t("fromLastMonth"), isPositive: true }}
      />
      <KPICard
        title={t("monthlyRevenue")}
        value={`${(kpi?.monthlyRevenue / 1000).toFixed(1)} $`}
        description={t("openInvoices", { count: kpi?.openInvoices })}
        icon={TrendingUp}
        trend={{ value: 15.5, label: t("fromLastMonth"), isPositive: true }}
      />
      <KPICard
        title={t("pendingOrders")}
        value={kpi?.pendingOrders}
        description={t("awaitingApproval")}
        icon={ShoppingCart}
      />
    </div>
  );
}

export default DashboardKPI;
