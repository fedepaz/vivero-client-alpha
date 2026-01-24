// src/features/dashboard/components/feature-navigation.tsx

import { FeatureCard } from "@/components/data-display/feature-card";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { useMemo } from "react";
import { NAVIGATION_CONFIG } from "@/lib/config/navigations";

function FeatureNavigation() {
  const { permissions } = useAuthContext();

  const featureCards = useMemo(() => {
    // Flatten all navigation items
    const allItems = NAVIGATION_CONFIG.flatMap((group) => group.items);

    // Filter visible items with dashboard metadata
    return allItems
      .filter((item) => {
        // Skip items without dashboard config
        if (!item.dashboard) return false;

        // Skip items without permission
        if (item.requiredPermission) {
          const { table } = item.requiredPermission;
          const perm = permissions[table];
          if (!perm?.canRead) return false;
        }

        return true;
      })
      .map((item) => ({
        title: item.title,
        href: item.href,
        icon: item.icon,
        description:
          item.description || `Gestionar ${item.title.toLowerCase()}`,
        statsLabel: item.dashboard!.statsLabel,
      }));
  }, [permissions]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {featureCards.map((card) => (
        <FeatureCard
          key={card.title}
          title={card.title}
          description={card.description}
          icon={card.icon}
          href={card.href}
        />
      ))}
    </div>
  );
}

export default FeatureNavigation;
