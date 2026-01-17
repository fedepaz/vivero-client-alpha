// src/components/common/coming-soon.tsx
"use client";

import { Sprout, BarChart, Smartphone, Cloud } from "lucide-react";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl w-full text-center space-y-6 md:space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sprout className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              AgriFlow
            </h1>
          </div>
        </div>

        {/* Main Message */}
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            {t("title")}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto">
            {t("description")}
          </p>
        </div>

        {/* Status Indicator */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-medium">{t("status")}</span>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 md:pt-8">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
              <BarChart className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">
              {t("feature1.title")}
            </h3>
            <p className="text-sm text-muted-foreground px-2">
              {t("feature1.description")}
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
              <Smartphone className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">
              {t("feature2.title")}
            </h3>
            <p className="text-sm text-muted-foreground px-2">
              {t("feature2.description")}
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
              <Cloud className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">
              {t("feature3.title")}
            </h3>
            <p className="text-sm text-muted-foreground px-2">
              {t("feature3.description")}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 md:pt-8 text-sm text-muted-foreground">
          <p>
            {t("footer.inquiries")}{" "}
            <a
              href="mailto:info@agriflow.com"
              className="text-primary hover:underline"
            >
              info@agriflow.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
