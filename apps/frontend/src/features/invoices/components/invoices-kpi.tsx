//src/features/invoices/components/invoices-kpi.tsx
"use client";

import { KPICard } from "@/components/data-display/kpi-card";
import { FileText, DollarSign, CheckCircle2, Clock } from "lucide-react";
import { useInvoices } from "../hooks/hooks";

function InvoiceKPIs() {
  const { data: mockInvoices = [] } = useInvoices();
  const t = "InvoiceKPIs";
  const totalInvoices = mockInvoices.length;
  const totalRevenue = mockInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidInvoices = mockInvoices.filter(
    (inv) => inv.status === "paid",
  ).length;
  const overdueInvoices = mockInvoices.filter(
    (inv) => inv.status === "overdue",
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title={t("totalInvoices")}
        value={totalInvoices}
        description={t("allTime")}
        icon={FileText}
        trend={{ value: 8.3, label: t("fromLastMonth"), isPositive: true }}
      />
      <KPICard
        title={t("totalRevenue")}
        value={`€${(totalRevenue / 1000).toFixed(1)}k`}
        description={t("fromAllInvoices")}
        icon={DollarSign}
        trend={{ value: 15.2, label: t("fromLastMonth"), isPositive: true }}
      />
      <KPICard
        title={t("paidInvoices")}
        value={paidInvoices}
        description={t("pending", { count: totalInvoices - paidInvoices })}
        icon={CheckCircle2}
      />
      <KPICard
        title={t("pendingInvoices")}
        value={overdueInvoices}
        description={t("requireFollowUp")}
        icon={Clock}
      />
    </div>
  );
}

export default InvoiceKPIs;
