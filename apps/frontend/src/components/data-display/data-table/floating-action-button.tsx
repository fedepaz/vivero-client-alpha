// src/components/common/floating-action-button.tsx

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export function FloatingActionButton({
  onClick,
  label,
  className,
}: FloatingActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className={cn(
        "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50",
        "md:h-auto md:w-auto md:rounded-md md:px-6",
        className,
      )}
      aria-label={label || t("addNew")}
    >
      <Plus className="h-6 w-6 md:mr-2" />
      <span className="hidden md:inline">{label || t("addNew")}</span>
    </Button>
  );
}
