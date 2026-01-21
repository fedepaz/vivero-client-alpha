// src/features/auth/components/register-form.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sprout,
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Check,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RegisterFormProps extends React.ComponentProps<"div"> {
  onSubmit?: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  loginUrl?: string;
}

function PasswordRequirement({ met, label }: { met: boolean; label: string }) {
  return (
    <li
      className={cn(
        "flex items-center gap-2 text-xs",
        met ? "text-primary" : "text-muted-foreground",
      )}
    >
      {met ? (
        <Check className="h-3 w-3" />
      ) : (
        <X className="h-3 w-3 text-muted-foreground/50" />
      )}
      {label}
    </li>
  );
}

export function RegisterForm({
  className,
  onSubmit,
  loginUrl = "/login",
  ...props
}: RegisterFormProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Password validation
  const passwordRequirements = React.useMemo(() => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    };
  }, [password]);

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isPasswordValid) {
      setError(
        "Por favor asegúrate que tu contraseña cumpla con todos los requisitos",
      );
      return;
    }

    if (!passwordsMatch) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);

    try {
      if (onSubmit) {
        await onSubmit({ name, email, password });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 md:p-8",
        className,
      )}
      {...props}
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
                    id="name"
                    type="text"
                    placeholder="Juan Pérez"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                {/* Password Requirements */}
                {password && (
                  <ul className="mt-2 grid gap-1 p-3 rounded-lg bg-muted/30">
                    <PasswordRequirement
                      met={passwordRequirements.minLength}
                      label="Al menos 8 caracteres"
                    />
                    <PasswordRequirement
                      met={passwordRequirements.hasUppercase}
                      label="Una letra mayúscula"
                    />
                    <PasswordRequirement
                      met={passwordRequirements.hasLowercase}
                      label="Una letra minúscula"
                    />
                    <PasswordRequirement
                      met={passwordRequirements.hasNumber}
                      label="Un número"
                    />
                  </ul>
                )}
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
                      confirmPassword &&
                        (passwordsMatch
                          ? "border-primary focus-visible:ring-primary/50"
                          : "border-destructive focus-visible:ring-destructive/50"),
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
                {confirmPassword && !passwordsMatch && (
                  <p className="text-xs text-destructive">
                    Las contraseñas no coinciden
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 rounded-lg text-base font-medium"
                disabled={isLoading || !isPasswordValid || !passwordsMatch}
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
            href={loginUrl}
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
