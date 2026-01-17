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
import Link from "next/link";

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
      title: t("groupOperations"),
      icon: Sprout,
      items: [
        {
          title: t("dashboard"),
          href: "/",
          icon: Home,
          description: t("overviewAndAlerts"),
        },
        {
          title: t("environment"),
          href: "/environment",
          icon: Thermometer,
          description: t("climateMonitoring"),
          badge: "3",
          badgeVariant: "destructive" as const,
        },
        {
          title: t("tasks"),
          href: "/tasks",
          icon: Calendar,
          description: t("dailyOperations"),
          badge: "12",
        },
      ],
    },
    {
      id: "management",
      title: t("groupManagement"),
      icon: Building,
      items: [
        { title: t("plants"), href: "/plants", icon: Sprout },
        { title: t("clients"), href: "/clients", icon: Users },
        { title: t("invoices"), href: "/invoices", icon: FileText },
        {
          title: t("purchaseOrders"),
          href: "/purchase-orders",
          icon: ShoppingCart,
        },
      ],
    },
    {
      id: "admin",
      title: t("groupAdmin"),
      icon: Settings,
      items: [
        { title: t("users"), href: "/users", icon: UserCircle },
        {
          title: t("analytics"),
          href: "/analytics",
          icon: BarChart3,
          description: t("analytics"),
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
          <SheetTitle className="sr-only">
            {tCommon("mobileNavigation")}
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">AG</span>
              </div>
              <div>
                <h2 className="font-bold text-lg">{tCommon("agriManage")}</h2>
                <p className="text-sm text-muted-foreground">
                  {tCommon("plantManagement")}
                </p>
              </div>
            </div>
          </div>

          {/* Critical Alerts Banner */}
          <div className="p-4 bg-red-50 border-b border-red-200">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">
                {tAlerts("criticalAlerts", { count: 3 })}
              </span>
            </div>
            <p className="text-xs text-red-600 mt-1">
              {tAlerts("temperatureIssues", { location: `Greenhouse B` })}
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
                                  ? "bg-green-100 text-green-700 border border-green-200"
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
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">JD</span>
              </div>
              <div>
                <p className="text-sm font-medium">{tCommon("johnDoe")}</p>
                <p className="text-xs text-muted-foreground">
                  {tCommon("greenhouseManager")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
