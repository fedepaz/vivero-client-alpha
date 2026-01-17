// src/features/dashboard/components/feature-navigation.tsx

import { FeatureCard } from "@/components/data-display/feature-card";
import {
  Sprout,
  Users,
  FileText,
  ShoppingCart,
  UserCircle,
} from "lucide-react";
import { useDashboardKPIs } from "../hooks/hooks";

function FeatureNavigation() {
  const t = "FeatureNavigation";
  const { data: kpis } = useDashboardKPIs();
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <FeatureCard
        title={t("plants")}
        description={t("managePlantInventory")}
        icon={Sprout}
        href="/plants"
        stats={{
          label: t("activePlants"),
          value: kpis.activePlants.toLocaleString(),
        }}
      />
      <FeatureCard
        title={t("clients")}
        description={t("manageClients")}
        icon={Users}
        href="/clients"
        stats={{ label: t("activeClients"), value: kpis.activeClients }}
      />
      <FeatureCard
        title={t("invoices")}
        description={t("manageInvoices")}
        icon={FileText}
        href="/invoices"
        stats={{ label: t("openInvoices"), value: kpis.openInvoices }}
      />
      <FeatureCard
        title={t("purchaseOrders")}
        description={t("managePurchaseOrders")}
        icon={ShoppingCart}
        href="/purchase-orders"
        stats={{ label: t("pendingOrders"), value: kpis.pendingOrders }}
      />
      <FeatureCard
        title={t("users")}
        description={t("manageUsers")}
        icon={UserCircle}
        href="/users"
        stats={{ label: t("activeUsers"), value: kpis.activeUsers }}
      />
    </div>
  );
}

export default FeatureNavigation;
