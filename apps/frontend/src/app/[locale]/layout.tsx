//src/app/[locale]/layout.tsx

import type React from "react";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { generateLocaleStaticParams, routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import getRequestConfig from "../../../src/i18n/request";
import { DesktopSidebar } from "@/components/layout/desktop-sidebar";
import { ThemeProvider } from "@/providers/theme-provider";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { ReactClientProvider } from "@/providers/query-client-provider";
import { notFound } from "next/navigation";
import ComingSoonPage from "@/components/common/coming-soon";
import { DashboardProtectedLayout } from "@/components/common/dashboard-protected-layout";

export function generateStaticParams() {
  return generateLocaleStaticParams();
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { messages } = await getRequestConfig({
    requestLocale: Promise.resolve(locale),
  });

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <ThemeProvider>
      <NextIntlClientProvider messages={messages}>
        {process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true" ? (
          <ComingSoonPage />
        ) : (
          <ReactClientProvider>
            <Suspense fallback={<LoadingSpinner />}>
              {/* Protected routes (Dashboard Layout) 
            commented out for now, but can be enabled later
              <DashboardProtectedLayout>
                */}
              <div className="flex h-screen overflow-hidden">
                <DesktopSidebar />
                <div className="flex flex-1 flex-col overflow-hidden">
                  <DashboardHeader />
                  <main className="flex-1 overflow-auto pb-16 md:pb-0">
                    {children}
                  </main>
                </div>
              </div>
              {/* </DashboardProtectedLayout> 
              </DashboardProtectedLayout>
                */}
            </Suspense>
          </ReactClientProvider>
        )}
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
