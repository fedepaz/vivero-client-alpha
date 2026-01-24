// src/components/common/pending-permissions.tsx
"use client";

import { UserX, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PendingPermissionsPage() {
  return (
    <div className="grid min-h-screen place-items-center px-6 py-24 sm:py-32 lg:px-8 bg-background">
      <div className="text-center max-w-2xl">
        <div className="relative mx-auto w-20 h-20 mb-6">
          <UserX className="w-20 h-20 text-muted-foreground/40" />
        </div>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground text-balance sm:text-6xl">
          Permisos Pendientes
        </h1>

        <p className="mt-6 text-lg font-medium text-pretty text-muted-foreground sm:text-xl/8">
          Tu cuenta ha sido creada exitosamente, pero aún no tienes roles o permisos asignados.
        </p>

        <div className="mt-8 p-6 rounded-lg bg-muted/50 border border-border">
          <p className="text-base text-foreground font-medium mb-2">
            ¿Qué sigue?
          </p>
          <p className="text-sm text-muted-foreground text-balance">
            Un administrador del sistema necesita asignarte un rol antes de que puedas
            acceder a la aplicación. Esto suele ocurrir dentro de las 24 horas posteriores a la
            creación de la cuenta.
          </p>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="outline"
            className="gap-2 bg-transparent"
            onClick={() =>
              (window.location.href = "mailto:support@yourcompany.com")
            }
          >
            <Mail className="w-4 h-4" />
            Contactar Administración
          </Button>
          <Button onClick={() => window.location.reload()}>
            Actualizar Estado
          </Button>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Si crees que esto es un error, por favor contacta a tu administrador.
        </p>
      </div>
    </div>
  );
}
