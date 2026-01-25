// src/lib/config/navigations.ts

import { ROUTES } from "@/constants/routes";
import {
  Sprout,
  Home,
  FileText,
  Settings,
  Users,
  BarChart3,
  Building,
  Database,
  Key,
  MessageSquare,
  ShoppingCart,
  UserCircle,
} from "lucide-react";

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
        // Always visible - no permission required
      },
    ],
  },
  {
    id: "management",
    title: "Gestión",
    icon: Building,
    items: [
      {
        title: "Plantas",
        href: ROUTES.PLANTS,
        icon: Sprout,
        description: "Inventario de plantas",
        dashboard: { statsLabel: "Plantas activas" },
        requiredPermission: { table: "plants", action: "read" },
      },
      {
        title: "Clientes",
        href: ROUTES.CLIENTS,
        icon: Users,
        description: "Gestión de clientes",
        dashboard: { statsLabel: "Clientes activos" },
        requiredPermission: { table: "clients", action: "read" },
      },
      {
        title: "Facturas",
        href: ROUTES.INVOICES,
        icon: FileText,
        description: "Facturación y pagos",
        dashboard: { statsLabel: "Facturas pendientes" },
        requiredPermission: { table: "invoices", action: "read" },
      },
      {
        title: "Órdenes de compra",
        href: ROUTES.PURCHASE_ORDERS,
        icon: ShoppingCart,
        description: "Pedidos y proveedores",
        dashboard: { statsLabel: "Pedidos pendientes" },
        requiredPermission: { table: "purchase_orders", action: "read" },
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
        icon: UserCircle,
        description: "Gestión de usuarios del sistema",
        dashboard: { statsLabel: "Usuarios activos" },
        requiredPermission: { table: "users", action: "read" },
      },
      {
        title: "Auditoría",
        href: ROUTES.AUDIT_LOGS,
        icon: BarChart3,
        description: "Registro de actividades del sistema",
        dashboard: { statsLabel: "Registros de auditoría" },
        requiredPermission: { table: "audit_logs", action: "read" },
      },
      {
        title: "Tenants",
        href: ROUTES.TENANTS,
        icon: Building,
        description: "Gestión de organizaciones",
        dashboard: { statsLabel: "Organizaciones activas" },
        requiredPermission: { table: "tenants", action: "read" },
      },
      {
        title: "Permisos de Usuario",
        href: ROUTES.USER_PERMISSIONS,
        icon: Key,
        description: "Configuración de permisos por usuario",
        dashboard: { statsLabel: "Permisos configurados" },
        requiredPermission: { table: "user_permissions", action: "read" },
      },
      {
        title: "Enums",
        href: ROUTES.ENUMS,
        icon: Database,
        description: "Valores de configuración del sistema",
        dashboard: { statsLabel: "Enumeraciones del sistema" },
        requiredPermission: { table: "enums", action: "read" },
      },
      {
        title: "Mensajes",
        href: ROUTES.MESSAGE,
        icon: MessageSquare,
        description: "Comunicaciones del sistema",
        dashboard: { statsLabel: "Mensajes del sistema" },
        requiredPermission: { table: "messages", action: "read" },
      },
    ],
  },
];
