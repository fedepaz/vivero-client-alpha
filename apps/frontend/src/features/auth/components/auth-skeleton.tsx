// src/features/auth/components/auth-skeleton.tsx

import type React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface AuthSkeletonProps extends React.ComponentProps<"div"> {
  /**
   * Type of auth form to render skeleton for
   * @default "login"
   */
  type?: "login" | "register";
}

export function AuthSkeleton({
  className,
  type = "login",
  ...props
}: AuthSkeletonProps) {
  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      role="status"
      aria-label="Loading authentication form"
      {...props}
    >
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          {/* Title skeleton */}
          <Skeleton className="mx-auto h-7 w-40" />
          {/* Description skeleton */}
          <Skeleton className="mx-auto mt-2 h-4 w-56" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-5">
            {/* Name field (register only) */}
            {type === "register" && (
              <div className="grid gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-9 w-full" />
              </div>
            )}

            {/* Email field */}
            <div className="grid gap-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-9 w-full" />
            </div>

            {/* Password field */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                {type === "login" && <Skeleton className="h-4 w-24" />}
              </div>
              <Skeleton className="h-9 w-full" />
            </div>

            {/* Confirm password field (register only) */}
            {type === "register" && (
              <div className="grid gap-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-9 w-full" />
              </div>
            )}

            {/* Submit button skeleton */}
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4 border-t pt-6">
          {/* Footer link skeleton */}
          <Skeleton className="mx-auto h-4 w-48" />
        </CardFooter>
      </Card>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
