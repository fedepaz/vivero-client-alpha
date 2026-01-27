//src/features/dashboard/components/dashboard-alerts.tsx

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDashboardAlerts } from "../hooks/hooks";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function DashboardAlerts() {
  const { data: alerts } = useDashboardAlerts();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="size-5" />
          Alertas Simuladas
        </CardTitle>
        <CardDescription>
          No hay alertas activas en este momento.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts?.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-3 rounded-lg border p-3"
            >
              <Badge
                variant={
                  alert.type === "critical"
                    ? "destructive"
                    : alert.type === "warning"
                      ? "default"
                      : "secondary"
                }
                className="mt-0.5"
              >
                {alert.type}
              </Badge>
              <div className="flex-1">
                <p className="text-sm font-medium">{alert.messageKey}</p>
                <p className="text-xs text-muted-foreground">
                  {alert.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default DashboardAlerts;
