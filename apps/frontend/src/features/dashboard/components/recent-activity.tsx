//src/features/dashboard/components/recent-activity.tsx

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDashboardRecentActivity } from "../hooks/hooks";

function RecentActivity() {
  const t = "RecentActivity";
  const { data: recentActivity } = useDashboardRecentActivity();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("noActivity")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-4">
        <div className="h-full overflow-y-auto pr-1 space-y-3">
          {recentActivity?.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0"
            >
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <div className="size-2 rounded-full bg-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-xs text-muted-foreground">
                  {t("byUser", { user: activity.user })} •{" "}
                  {activity.timestamp.toISOString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentActivity;
