// src/components/common/not-found.tsx
"use client";

import { FlagIcon } from "lucide-react";
import Link from "next/link";

export function NotFoundPage() {
  return (
    <div className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <FlagIcon className="w-20 h-20 mx-auto mt-4 text-gray-300 text-5xl font-semibold tracking-tight text-balance sm:text-7xl" />
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-gray-300 text-balance sm:text-7xl">
          Error 404
        </h1>
        <p className="mt-3 text-xl font-bold text-pretty text-gray-200 sm:text-xl/8">
          {t("title")}
        </p>

        <p className="mt-6 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
          {t("description")}
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90">
            {t("goBack")}
          </button>
          <Link
            href={"/"}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            {t("backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
