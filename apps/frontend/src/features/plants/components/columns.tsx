// src/features/plants/components/columns.tsx

import { Row, Table, type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  SortableHeader,
  StatusBadge,
} from "@/components/data-display/data-table";
import { Plant } from "../types";

interface CellProps {
  row?: Row<Plant>;
  table?: Table<Plant>;
}

function CellComponent({ row, table }: CellProps) {
  const t = "PlantsColumns";
  if (row) {
    return (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={t("selectRow")}
      />
    );
  }
  if (table) {
    return (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label={t("selectAll")}
      />
    );
  }
  if (!row || !table) return null;
}

interface HeaderProps {
  column: ColumnDef<Plant>;
  translationKey: string;
}

function HeaderComponent({ column, translationKey }: HeaderProps) {
  const t = "PlantsColumns";
  return <SortableHeader column={column}>{t(translationKey)}</SortableHeader>;
}

function CellBadgeComponent({ row }: CellProps) {
  const t = "PlantsColumns";
  if (!row) return null;
  const status = row.getValue("status") as string;
  return (
    <StatusBadge
      status={row.getValue("status") as "healthy" | "warning" | "critical"}
    >
      {t(status)}
    </StatusBadge>
  );
}

export const plantColumns: ColumnDef<Plant>[] = [
  {
    id: "select",
    header: ({ table }) => {
      return <CellComponent table={table} />;
    },
    cell: ({ row }) => {
      return <CellComponent row={row} />;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <HeaderComponent column={column} translationKey="name" />;
    },
  },
  {
    accessorKey: "species",
    header: ({ column }) => {
      return <HeaderComponent column={column} translationKey="species" />;
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => {
      return <HeaderComponent column={column} translationKey="location" />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <HeaderComponent column={column} translationKey="status" />;
    },
    cell: ({ row }) => {
      return <CellBadgeComponent row={row} />;
    },
  },
  {
    accessorKey: "growthStage",
    header: ({ column }) => {
      return <HeaderComponent column={column} translationKey="growthStage" />;
    },
  },
  {
    accessorKey: "plantedDate",
    header: ({ column }) => {
      return <HeaderComponent column={column} translationKey="plantedDate" />;
    },
  },
  {
    accessorKey: "lastWatered",
    header: ({ column }) => {
      return <HeaderComponent column={column} translationKey="lastWatered" />;
    },
  },
];
