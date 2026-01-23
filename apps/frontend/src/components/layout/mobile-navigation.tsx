"use client";

import { cn } from "@/lib/utils";
import {
  Home,
  Thermometer,
  Calendar,
  Users,
  BarChart3,
  Settings,
  Menu,
  AlertTriangle,
  FileText,
  ShoppingCart,
  Sprout,
  UserCircle,
  Building,
  ChevronDown,
} from "lucide-react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ElementType;
  description?: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}

interface NavigationGroup {
  id: string;
  title: string;
  icon: React.ElementType;
  items: NavigationItem[];
}

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
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
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden agricultural-touch-target"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader>
          <SheetTitle className="sr-only">Navegación móvil</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">AG</span>
              </div>
              <div>
                <h2 className="font-bold text-lg">AgriManage</h2>
                <p className="text-sm text-muted-foreground">
                  Gestión de Plantas
                </p>
              </div>
            </div>
          </div>

          {/* Critical Alerts Banner */}
          <div className="p-4 bg-destructive/10 border-b border-destructive/20">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Alertas críticas (3)</span>
            </div>
            <p className="text-xs text-destructive mt-1">
              Problemas de temperatura en Invernadero B
            </p>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigationGroups.map((group) => {
              const GroupIcon = group.icon;
              const isExpanded = expandedGroups.has(group.id);

              return (
                <div key={group.id}>
                  {/* Group Header */}
                  <Button
                    variant="ghost"
                    onClick={() => toggleGroup(group.id)}
                    className="w-full justify-start gap-2 font-medium text-base p-3 h-auto"
                  >
                    <GroupIcon className="h-5 w-5 shrink-0" />
                    <span className="flex-1 text-left">{group.title}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isExpanded && "rotate-180",
                      )}
                    />
                  </Button>

                  {/* Group Items */}
                  {isExpanded && (
                    <div className="space-y-1 ml-4 mt-1">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                          >
                            <div
                              className={cn(
                                "flex items-center space-x-3 p-3 rounded-lg transition-colors agricultural-touch-target",
                                isActive
                                  ? "bg-primary/10 text-primary border border-primary/20"
                                  : "hover:bg-muted text-muted-foreground hover:text-foreground",
                              )}
                            >
                              <Icon className="h-5 w-5" />
                              <div className="flex-1">
                                <p className="font-medium text-sm">
                                  {item.title}
                                </p>
                                {item.description && (
                                  <p className="text-xs opacity-75">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                              {item.badge && (
                                <Badge
                                  variant={item.badgeVariant || "secondary"}
                                  className="text-xs"
                                >
                                  {item.badge}
                                </Badge>
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
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {userProfile?.firstName?.charAt(0)}
                  {userProfile?.lastName?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">
                  {userProfile?.firstName} {userProfile?.lastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {userProfile?.username}
                </p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
