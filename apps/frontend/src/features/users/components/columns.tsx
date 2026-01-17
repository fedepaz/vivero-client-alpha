import { Row, Table, type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  SortableHeader,
  StatusBadge,
} from "@/components/data-display/data-table";
import { User } from "../types";

interface CellProps {
  row?: Row<User>;
  table?: Table<User>;
}

function CellComponent({ row, table }: CellProps) {
  const t = "UserColumns";
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
  column: ColumnDef<User>;
  translationKey: string;
}

function HeaderComponent({ column, translationKey }: HeaderProps) {
  const t = "UserColumns";
  return <SortableHeader column={column}>{t(translationKey)}</SortableHeader>;
}

function CellBadgeRoleComponent({ row }: CellProps) {
  const t = "UserColumns";
  if (!row) return null;
  const role = row.getValue("role") as string;
  return (
    <StatusBadge status={role === "admin" ? "critical" : "info"}>
      {t(role)}
    </StatusBadge>
  );
}

function CellBadgeStatusComponent({ row }: CellProps) {
  const t = "UserColumns";
  if (!row) return null;
  const status = row.getValue("status") as string;
  return (
    <StatusBadge status={status === "active" ? "healthy" : "inactive"}>
      {t(status)}
    </StatusBadge>
  );
}

export const userColumns: ColumnDef<User>[] = [
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
    accessorKey: "email",
    header: ({ column }) => {
      return <HeaderComponent column={column} translationKey="email" />;
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return <HeaderComponent column={column} translationKey="role" />;
    },
    cell: ({ row }) => {
      return <CellBadgeRoleComponent row={row} />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <HeaderComponent column={column} translationKey="status" />;
    },
    cell: ({ row }) => {
      return <CellBadgeStatusComponent row={row} />;
    },
  },
  {
    accessorKey: "department",
    header: ({ column }) => {
      return <HeaderComponent column={column} translationKey="department" />;
    },
  },
  {
    accessorKey: "lastLogin",
    header: ({ column }) => {
      return <HeaderComponent column={column} translationKey="lastLogin" />;
    },
  },
];
