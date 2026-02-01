"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const messages = [
  "Compilando con Internet Explorer 6...",
  "Esperando que Flash Player se actualice...",
  "Desfragmentando el disco duro del servidor...",
  "Reiniciando Windows ME por tercera vez...",
  "Descargando 56k de pura nostalgia...",
  "Buscando drivers en DriverGuide.com...",
  "Esperando que termine de cargar RealPlayer...",
  "Liberando memoria con el Administrador de Tareas...",
  "Rogando que no sea una Pantalla Azul...",
  "Conectando por dial-up a las 3 AM...",
  "Instalando 47 barras de herramientas de Ask Jeeves...",
  "Esperando que WinRAR deje de pedir licencia...",
];

function getRandomMessage() {
  return messages[Math.floor(Math.random() * messages.length)];
}

export function LoadingSpinner() {
  const [currentMessage, setCurrentMessage] = useState(() =>
    getRandomMessage(),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(getRandomMessage());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      {/* Ambient glow effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-12">
        {/* Modern orbital loader */}
        <div className="relative w-24 h-24">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-border" />

          {/* Animated arc */}
          <svg
            className="absolute inset-0 w-full h-full animate-spin"
            style={{ animationDuration: "1.5s" }}
          >
            <circle
              cx="48"
              cy="48"
              r="46"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="100 200"
              className="text-primary"
            />
          </svg>

          {/* Inner pulsing dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          </div>

          {/* Orbiting dots */}
          <div
            className="absolute inset-0 animate-spin"
            style={{ animationDuration: "3s" }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/60" />
          </div>
          <div
            className="absolute inset-0 animate-spin"
            style={{ animationDuration: "4s", animationDirection: "reverse" }}
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/40" />
          </div>
        </div>

        {/* Message container */}
        <div className="flex flex-col items-center gap-3 max-w-sm px-6">
          <p
            className={cn(
              "text-sm font-medium text-muted-foreground text-center transition-all duration-300",
              "opacity-100 translate-y-0",
            )}
          >
            {currentMessage}
          </p>

          {/* Minimal progress indicator */}
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full bg-primary/30 animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
