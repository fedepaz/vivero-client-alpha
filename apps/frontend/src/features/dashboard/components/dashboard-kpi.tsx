//src/features/dashboard/components/dashboard-kpi.tsx

import { KPICard } from "@/components/data-display/kpi-card";
import { useDashboardKPIs } from "../hooks/hooks";
import { ShoppingCart, TrendingUp } from "lucide-react";

function DashboardKPI() {
  const { data: kpi } = useDashboardKPIs();
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      <KPICard
        title="Ingresos mensuales"
        value={`${(kpi?.monthlyRevenue / 1000).toFixed(1)} $`}
        description={`${kpi?.openInvoices} Facturas pendientes`}
        icon={TrendingUp}
        trend={{ value: 15.5, label: "desde el mes pasado", isPositive: true }}
      />
      <KPICard
        title="Pedidos pendientes"
        value={kpi?.pendingOrders}
        description="Pendiente de aprobación"
        icon={ShoppingCart}
      />
    </div>
  );
}

export default DashboardKPI;
