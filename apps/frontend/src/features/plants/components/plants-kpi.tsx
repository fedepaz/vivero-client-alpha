//src/features/plants/components/plants-kpi.tsx
"use client";

import { KPICard } from "@/components/data-display/kpi-card";
import { usePlants } from "../hooks/hooks";
import { Sprout, Leaf, AlertTriangle, Droplets } from "lucide-react";

function PlantKPIs() {
  const t = "PlantKPIs";
  const { data: mockPlants = [] } = usePlants();
  const totalPlants = mockPlants.length;
  const healthyPlants = mockPlants.filter((p) => p.status === "healthy").length;
  const criticalPlants = mockPlants.filter(
    (p) => p.status === "critical",
  ).length;
  const readyForHarvest = mockPlants.filter(
    (p) => p.growthStage === "Fruiting" || p.growthStage === "Mature",
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title={t("totalPlants")}
        value={totalPlants}
        description={t("activeInSystem")}
        icon={Sprout}
        trend={{ value: 12.5, label: t("fromLastMonth"), isPositive: true }}
      />
      <KPICard
        title={t("healthyPlants")}
        value={healthyPlants}
        description={t("ofTotal", {
          percentage: ((healthyPlants / totalPlants) * 100).toFixed(0),
        })}
        icon={Leaf}
        trend={{ value: 5.2, label: t("fromLastWeek"), isPositive: true }}
      />
      <KPICard
        title={t("alertPlants")}
        value={criticalPlants}
        description={t("requireImmediateAttention")}
        icon={AlertTriangle}
      />
      <KPICard
        title={t("readyForHarvest")}
        value={readyForHarvest}
        description={t("matureOrFruitingStage")}
        icon={Droplets}
      />
    </div>
  );
}

export default PlantKPIs;
