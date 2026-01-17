// src/components/data-display/data-table/inline-edit-row.tsx

import type * as React from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

interface InlineEditRowProps {
  isExpanded: boolean;
  onToggle: () => void;
  onMoreDetails: () => void;
  children: React.ReactNode;
  colSpan: number;
}

export function InlineEditRow({
  isExpanded,
  onToggle,
  onMoreDetails,
  children,
  colSpan,
}: InlineEditRowProps) {
  return (
    <>
      {isExpanded && (
        <TableRow className="bg-accent/30 hover:bg-accent/30">
          <TableCell colSpan={colSpan} className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {children}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={onToggle}
                  className="min-h-[48px] bg-transparent"
                >
                  {t("cancelButton")}
                </Button>
                <Button
                  variant="outline"
                  onClick={onMoreDetails}
                  className="min-h-[48px] bg-transparent"
                >
                  {t("moreDetailsButton")}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button className="min-h-[48px] min-w-[100px]">
                  {t("saveButton")}
                </Button>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
