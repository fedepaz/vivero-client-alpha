//src/features/purchase-orders/components/purchase-orders-kpi.tsx
"use client";

import { KPICard } from "@/components/data-display/kpi-card";
import { usePurchaseOrders } from "../hooks/hooks";
import { ShoppingCart, Package, Clock, CheckCircle2 } from "lucide-react";

function PurchaseOrderKPIs() {
  const t = "PurchaseOrderKPIs";
  const { data: purchaseOrders = [] } = usePurchaseOrders();
  const totalOrders = purchaseOrders.length;
  const totalSpend = purchaseOrders.reduce(
    (sum, po) => sum + po.totalAmount,
    0,
  );
  const pendingOrders = purchaseOrders.filter(
    (po) => po.status === "pending",
  ).length;
  const receivedOrders = purchaseOrders.filter(
    (po) => po.status === "received",
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title={t("totalOrders")}
        value={totalOrders}
        description={t("allTime")}
        icon={ShoppingCart}
        trend={{ value: 10.5, label: t("fromLastMonth"), isPositive: true }}
      />
      <KPICard
        title={t("totalSpend")}
        value={`€${(totalSpend / 1000).toFixed(1)}k`}
        description={t("fromAllOrders")}
        icon={Package}
        trend={{ value: 12.8, label: t("fromLastMonth"), isPositive: false }}
      />
      <KPICard
        title={t("pendingOrders")}
        value={pendingOrders}
        description={t("awaitingReview")}
        icon={Clock}
      />
      <KPICard
        title={t("completedOrders")}
        value={receivedOrders}
        description={t("completedOrdersDescription")}
        icon={CheckCircle2}
      />
    </div>
  );
}

export default PurchaseOrderKPIs;
