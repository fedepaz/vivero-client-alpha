import { Row, Table, type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  SortableHeader,
  StatusBadge,
} from "@/components/data-display/data-table";
import { PurchaseOrder } from "../types";
import { useLocale } from "next-intl";

interface CellProps {
  row?: Row<PurchaseOrder>;
  table?: Table<PurchaseOrder>;
}

function CellComponent({ row, table }: CellProps) {
  const t = "PurchaseOrderColumns";
  if (table) {
    return (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label={t("selectAll")}
      />
    );
  }
  if (row) {
    return (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={t("selectRow")}
      />
    );
  }
  if (!row || !table) {
    return null;
  }
}

interface HeaderProps {
  column: ColumnDef<PurchaseOrder>;
  translationKey: string;
}

function HeaderComponent({ column, translationKey }: HeaderProps) {
  const t = "PurchaseOrderColumns";
  return <SortableHeader column={column}>{t(translationKey)}</SortableHeader>;
}

function CellTotalAmountComponent({ row }: CellProps) {
  const locale = useLocale();
  if (!row) return null;
  const amount = Number.parseFloat(row.getValue("totalAmount"));
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(amount);
  return <div className="font-medium">{formatted}</div>;
}

function CellBadgeComponent({ row }: CellProps) {
  const t = "PurchaseOrderColumns";
  if (!row) return null;
  const status = row.getValue("status") as string;
  const statusMap = {
    delivered: "healthy",
    approved: "info",
    pending: "warning",
    cancelled: "critical",
  } as const;
  return (
    <StatusBadge status={statusMap[status as keyof typeof statusMap]}>
      {t(status)}
    </StatusBadge>
  );
}
export const purchaseOrderColumns: ColumnDef<PurchaseOrder>[] = [
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
    accessorKey: "orderNumber",
    header: ({ column }) => {
      return <HeaderComponent column={column} translationKey="orderNumber" />;
    },
  },
  {
    accessorKey: "supplier",
    header: ({ column }) => {
      return <HeaderComponent column={column} translationKey="supplier" />;
    },
  },
  {
    accessorKey: "items",
    header: ({ column }) => {
      return <HeaderComponent column={column} translationKey="items" />;
    },
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => {
      return <HeaderComponent column={column} translationKey="totalAmount" />;
    },
    cell: ({ row }) => {
      return <CellTotalAmountComponent row={row} />;
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
    accessorKey: "orderDate",
    header: ({ column }) => {
      return <HeaderComponent column={column} translationKey="orderDate" />;
    },
  },
  {
    accessorKey: "deliveryDate",
    header: ({ column }) => {
      return <HeaderComponent column={column} translationKey="deliveryDate" />;
    },
  },
];
