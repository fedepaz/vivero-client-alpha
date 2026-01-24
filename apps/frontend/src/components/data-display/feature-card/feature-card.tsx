// app/components/data-display/feature-card/feature-card.tsx

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface FeatureCardProps {
  title: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  href: string;

  className?: string;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  href,
  className,
}: FeatureCardProps) {
  return (
    <Link href={href}>
      <Card
        className={cn(
          "group transition-all hover:shadow-md hover:border-primary/50",
          className,
        )}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-6" />
            </div>
            <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </div>
          <CardTitle className="mt-4">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
