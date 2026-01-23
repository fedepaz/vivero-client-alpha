"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Home,
  Thermometer,
  Users,
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  ShoppingCart,
  Sprout,
  UserCircle,
  Building,
  Settings,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";

interface NavigationItem {
  title: string;
  href: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  description?: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}

interface NavigationGroup {
  id: string;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  items: NavigationItem[];
}

export function DesktopSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const { userProfile } = useAuthContext();

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(["operations"]),
  );

  const toggleGroup = (groupId: string) => {
    const newExpandedGroups = new Set(expandedGroups);
    if (newExpandedGroups.has(groupId)) {
      newExpandedGroups.delete(groupId);
    } else {
      newExpandedGroups.add(groupId);
    }
    setExpandedGroups(newExpandedGroups);
  };
  const navigationGroups: NavigationGroup[] = [
    {
      id: "operations",
      title: "Operaciones",
      icon: Sprout,
      items: [
        {
          title: "Dashboard",
          href: "/",
          icon: Home,
          description: "Vista general y alertas",
        },
        {
          title: "Entorno",
          href: "/environment",
          icon: Thermometer,
          description: "Monitorización climática",
          badge: "3",
          badgeVariant: "destructive" as const,
        },
        {
          title: "Tareas",
          href: "/tasks",
          icon: Calendar,
          description: "Operaciones diarias",
          badge: "12",
        },
      ],
    },
    {
      id: "management",
      title: "Gestión",
      icon: Building,
      items: [
        { title: "Plantas", href: "/plants", icon: Sprout },
        { title: "Clientes", href: "/clients", icon: Users },
        { title: "Facturas", href: "/invoices", icon: FileText },
        {
          title: "Órdenes de compra",
          href: "/purchase-orders",
          icon: ShoppingCart,
        },
      ],
    },
    {
      id: "admin",
      title: "Administración",
      icon: Settings,
      items: [
        { title: "Usuarios", href: "/users", icon: UserCircle },
        {
          title: "Analíticas",
          href: "/analytics",
          icon: BarChart3,
          description: "Analíticas",
        },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col bg-card border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8  rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AG</span>
              </div>
              <div>
                <h2 className="font-bold">AgriManage</h2>
                <p className="text-xs text-muted-foreground">
                  Gestión de Plantas
                </p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {navigationGroups.map((group) => {
          const GroupIcon = group.icon;
          const isExpanded = expandedGroups.has(group.id);

          return (
            <div key={group.id}>
              {/* Group Header */}
              <Button
                variant="ghost"
                onClick={() => !isCollapsed && toggleGroup(group.id)}
                className={cn(
                  "w-full justify-start gap-2 font-medium",
                  isCollapsed && "justify-center",
                )}
              >
                <GroupIcon className="h-5 w-5 shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left text-sm">
                      {group.title}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isExpanded && "rotate-180",
                      )}
                    />
                  </>
                )}
              </Button>

              {/* Group Items */}
              {(isExpanded || isCollapsed) && (
                <div className={cn("space-y-1", !isCollapsed && "ml-3 mt-1")}>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <Link key={item.href} href={item.href}>
                        <div
                          className={cn(
                            "flex items-center space-x-3 p-2 rounded-lg transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "hover:bg-muted text-muted-foreground hover:text-foreground",
                            isCollapsed && "justify-center",
                          )}
                        >
                          <div className="relative">
                            <Icon className="h-5 w-5" />
                            {item.badge && isCollapsed && (
                              <Badge
                                variant={item.badgeVariant || "secondary"}
                                className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
                              >
                                {item.badge.length > 2 ? "99+" : item.badge}
                              </Badge>
                            )}
                          </div>
                          {!isCollapsed && (
                            <>
                              <div className="flex-1">
                                <p className="font-medium text-sm">
                                  {item.title}
                                </p>
                                <p className="text-xs opacity-75">
                                  {item.description}
                                </p>
                              </div>
                              {item.badge && (
                                <Badge
                                  variant={item.badgeVariant || "secondary"}
                                  className="text-xs"
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-3 border-t">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {userProfile?.firstName?.charAt(0)}
                {userProfile?.lastName?.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">
                {userProfile?.firstName + " " + userProfile?.lastName}
              </p>
              <p className="text-xs text-muted-foreground">
                {userProfile?.username}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
