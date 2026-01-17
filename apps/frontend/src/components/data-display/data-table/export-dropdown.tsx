// src/components/common/export-dropdown.tsx

import { Download, FileSpreadsheet, FileText, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExportDropdownProps {
  onExport: (format: "csv" | "excel" | "json" | "pdf") => void;
  selectedCount?: number;
  totalCount?: number;
  disabled?: boolean;
}

export function ExportDropdown({
  onExport,
  selectedCount = 0,
  totalCount = 0,
  disabled = false,
}: ExportDropdownProps) {
  const exportLabel =
    selectedCount > 0
      ? t("exportSelected", { count: selectedCount })
      : t("exportAll", { count: totalCount });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="min-h-[40px] bg-transparent"
        >
          <Download className="mr-2 h-4 w-4" />
          {t("export")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{exportLabel}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onExport("csv")}>
          <FileText className="mr-2 h-4 w-4" />
          {t("csvFormat")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport("excel")}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          {t("excelFormat")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport("json")}>
          <FileJson className="mr-2 h-4 w-4" />
          {t("jsonFormat")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
