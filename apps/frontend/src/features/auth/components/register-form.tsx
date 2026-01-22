// src/features/auth/components/register-form.tsx
"use client";

import Link from "next/link";
import { Sprout, Loader2, Mail, Lock, Eye, EyeOff, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRegister } from "../hooks/useRegister";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [roleId, setRoleId] = useState("");
  const router = useRouter();

  const { registerAsync, isLoading } = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await registerAsync({
        email,
        password,
        firstName,
        lastName,
        tenantId,
        roleId,
      });
      // Optionally redirect on success — or let useAuth handle it via context
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar");
      console.error(err);
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 md:p-8",
      )}
    >
      <div className="max-w-md w-full space-y-6 md:space-y-8">
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
        <div className="space-y-2 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Crea tu cuenta
          </h2>
          <p className="text-muted-foreground">
            Ingresa tu información para comenzar
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm space-y-6">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
              {/* Error Message */}
              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                  {error}
                </div>
              )}

              {/* Name Field */}
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-foreground">
                  Nombre completo
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Juan"
                    autoComplete="firstName"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isLoading}
                    className="pl-14 h-12 rounded-lg"
                  />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Pérez"
                    autoComplete="lastName"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isLoading}
                    className="pl-14 h-12 rounded-lg"
                  />
                  <Input
                    id="tenantId"
                    type="text"
                    placeholder="00000000-0000-0000-0000-000000000000"
                    autoComplete="tenantId"
                    required
                    value={tenantId}
                    onChange={(e) => setTenantId(e.target.value)}
                    disabled={isLoading}
                    className="pl-14 h-12 rounded-lg"
                  />
                  <Input
                    id="roleId"
                    type="text"
                    placeholder="00000000-0000-0000-0000-000000000000"
                    autoComplete="roleId"
                    required
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    disabled={isLoading}
                    className="pl-14 h-12 rounded-lg"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-foreground">
                  Correo electrónico
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nombre@ejemplo.com"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="pl-14 h-12 rounded-lg"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-foreground">
                  Contraseña
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Lock className="h-4 w-4 text-primary" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Crea una contraseña"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="pl-14 pr-12 h-12 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    tabIndex={-1}
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="grid gap-2">
                <Label htmlFor="confirm-password" className="text-foreground">
                  Confirmar contraseña
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Lock className="h-4 w-4 text-primary" />
                  </div>
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirma tu contraseña"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    className={cn(
                      "pl-14 pr-12 h-12 rounded-lg",
                      confirmPassword,
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    tabIndex={-1}
                    aria-label={
                      showConfirmPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {confirmPassword && (
                  <p className="text-xs text-destructive">
                    Las contraseñas no coinciden
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 rounded-lg text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  "Crear cuenta"
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href={"/login"}
            className="font-medium text-primary underline-offset-4 hover:underline"
            tabIndex={isLoading ? -1 : 0}
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
