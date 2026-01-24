// src/lib/config/navigations.ts

import { ROUTES } from "@/constants/routes";
import { Sprout, Home, FileText, Settings, Users } from "lucide-react";

export interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType;
  description?: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  dashboard?: {
    statsLabel: string; // e.g., "Plantas activas"
    // Note: Actual stats value will come from KPIs hook
  };
  requiredPermission?: {
    table: string; // must match Prisma @@map name
    action: "read"; // for visibility, we only care about read
  };
}

export interface NavigationGroup {
  id: string;
  title: string;
  icon: React.ComponentType;
  items: NavigationItem[];
}

export const NAVIGATION_CONFIG: NavigationGroup[] = [
  {
    id: "operations",
    title: "Operaciones",
    icon: Sprout,
    items: [
      {
        title: "Dashboard",
        href: ROUTES.DASHBOARD,
        icon: Home,
        description: "Vista general y alertas",
        // No requiredPermission → always visible
      },
    ],
  },
  {
    id: "management",
    title: "Gestión",
    icon: Sprout,
    items: [
      {
        title: "Plantas",
        href: ROUTES.PLANTS,
        icon: Sprout,
        dashboard: { statsLabel: "Plantas activas" },
        requiredPermission: { table: "plants", action: "read" },
      },
      {
        title: "Facturas",
        href: ROUTES.INVOICES,
        icon: FileText,
        dashboard: { statsLabel: "Facturas pendientes" },
        requiredPermission: { table: "invoices", action: "read" },
      },
    ],
  },
  {
    id: "admin",
    title: "Administración",
    icon: Settings,
    items: [
      {
        title: "Usuarios",
        href: ROUTES.USERS,
        icon: Users,
        dashboard: { statsLabel: "Usuarios activos" },
        requiredPermission: { table: "users", action: "read" },
      },
      {
        title: "Auditoría",
        href: ROUTES.AUDIT_LOGS,
        icon: FileText,
        dashboard: { statsLabel: "Auditoría" },
        requiredPermission: { table: "audit_logs", action: "read" },
      },
    ],
  },
];
