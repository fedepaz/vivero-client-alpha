import { Row, Table, type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  SortableHeader,
  StatusBadge,
} from "@/components/data-display/data-table";
import { UserProfileDto } from "@vivero/shared";

interface CellProps {
  row?: Row<UserProfileDto>;
  table?: Table<UserProfileDto>;
}

function CellComponent({ row, table }: CellProps) {
  if (row) {
    return (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Seleccionar fila"
      />
    );
  }
  if (table) {
    return (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todo"
      />
    );
  }
  if (!row || !table) return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FullNameCell({ row }: { row: any }) {
  const user = row.original as UserProfileDto;
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  return <span>{fullName || "No name"}</span>;
}

function StatusCell({ row }: CellProps) {
  if (!row) return null;
  const user = row.original as UserProfileDto;
  return (
    <StatusBadge status={user.isActive ? "healthy" : "inactive"}>
      {user.isActive ? "Activo" : "Inactivo"}
    </StatusBadge>
  );
}

export const userColumns: ColumnDef<UserProfileDto>[] = [
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
    accessorKey: "username",
    header: ({ column }) => {
      return <SortableHeader column={column}>Usuario</SortableHeader>;
    },
  },
  {
    id: "fullName",
    header: ({ column }) => (
      <SortableHeader column={column}>Nombre completo</SortableHeader>
    ),
    cell: ({ row }) => {
      return <FullNameCell row={row} />;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <SortableHeader column={column}>Correo electrónico</SortableHeader>
    ),
    cell: ({ row }) => row.getValue("email"),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <SortableHeader column={column}>Estado</SortableHeader>
    ),
    cell: ({ row }) => <StatusCell row={row} />,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortableHeader column={column}>Creado</SortableHeader>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString();
    },
  },
];
