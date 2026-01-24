// src/components/common/database-unavailable.tsx

"use client";

import { DatabaseZap, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DatabaseUnavailablePage() {
  return (
    <div className="grid min-h-screen place-items-center px-6 py-24 sm:py-32 lg:px-8 bg-background">
      <div className="text-center max-w-2xl">
        <div className="relative mx-auto w-20 h-20 mb-6">
          <DatabaseZap className="w-20 h-20 text-muted-foreground/40" />
        </div>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground text-balance sm:text-6xl">
          Servicio Temporalmente No Disponible
        </h1>

        <p className="mt-6 text-lg font-medium text-pretty text-muted-foreground sm:text-xl/8">
          Actualmente estamos realizando mantenimiento en nuestros sistemas de base de datos.
        </p>

        <div className="mt-8 p-6 rounded-lg bg-muted/50 border border-border">
          <p className="text-base text-foreground font-medium mb-2">
            Mantenimiento del Sistema
          </p>
          <p className="text-sm text-muted-foreground text-balance">
            Nuestro equipo está trabajando para restaurar el servicio completo lo antes posible.
            Lamentamos cualquier inconveniente que esto pueda causar.
          </p>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="outline"
            className="gap-2 bg-transparent"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4" />
            Intentar de Nuevo
          </Button>
          <Button
            variant="secondary"
            onClick={() => (window.location.href = "/")}
          >
            Ir a la Página Principal
          </Button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            Mantenimiento en curso
          </div>
        </div>
      </div>
    </div>
  );
}
