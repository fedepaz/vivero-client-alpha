//src/features/invoices/components/columns.tsx

import {
  SortableHeader,
  StatusBadge,
} from "@/components/data-display/data-table";

import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { Invoice } from "../types";
import { useLocale } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";

interface CellProps {
  row?: Row<Invoice>;
  table?: Table<Invoice>;
}

function CellComponent({ row, table }: CellProps) {
  const t = "InvoiceColumns";

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
  return null;
}

interface HeaderProps {
  column: ColumnDef<Invoice>;
  translationKey: string;
}

function HeaderComponent({ column, translationKey }: HeaderProps) {
  const t = "InvoiceColumns";
  return <SortableHeader column={column}>{t(translationKey)}</SortableHeader>;
}

function CellBadgeComponent({ row }: CellProps) {
  const t = "InvoiceColumns";
  if (!row) return null;
  const status = row.getValue("status") as string;
  const statusMap = {
    draft: "info",
    sent: "healthy",
    paid: "active",
    overdue: "pending",
    cancelled: "inactive",
  } as const;
  return (
    <StatusBadge status={statusMap[status as keyof typeof statusMap]}>
      {t(status)}
    </StatusBadge>
  );
}

function CellAmountComponent({ row }: CellProps) {
  const locale = useLocale();
  if (!row) return null;
  const amount = Number.parseFloat(row.getValue("amount"));
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(amount);
  return <div className="font-medium">{formatted}</div>;
}

const invoiceColumns: ColumnDef<Invoice>[] = [
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
    accessorKey: "invoiceNumber",
    header: ({ column }) => {
      return <HeaderComponent column={column} translationKey="invoiceNumber" />;
    },
  },
  {
    accessorKey: "client",
    header: ({ column }) => {
      return <HeaderComponent column={column} translationKey="client" />;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return <HeaderComponent column={column} translationKey="amount" />;
    },
    cell: ({ row }) => {
      return <CellAmountComponent row={row} />;
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
    accessorKey: "createdDate",
    header: ({ column }) => {
      return <HeaderComponent column={column} translationKey="createdDate" />;
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return <HeaderComponent column={column} translationKey="dueDate" />;
    },
  },
];

export { invoiceColumns };
