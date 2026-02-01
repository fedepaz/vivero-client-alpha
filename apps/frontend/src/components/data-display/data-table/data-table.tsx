// src/components/data-display/data-table/data-table.tsx
"use client";

import { Fragment, ReactNode, useMemo, useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ExportDropdown } from "@/components/data-display/data-table/export-dropdown";
import { DeleteDialog } from "@/components/data-display/data-table/delete-dialog-button";
import { usePermission } from "@/hooks/usePermission";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title: string;
  tableName: string;
  description?: string;

  onEdit?: (row: TData) => void;
  onDelete?: (row: TData) => void;
  onExport?: (
    format: "csv" | "excel" | "json" | "pdf",
    selectedRows: TData[],
  ) => void;
  loading?: boolean;
  totalCount?: number;
  renderInlineEdit?: (
    row: TData,
    onSave: () => void,
    onCancel: () => void,
  ) => ReactNode;
}

function HeaderComponent({ titulo }: { titulo: string }) {
  return (
    <div className="items-center justify-between">
      <div className="text-center"> {titulo}</div>
    </div>
  );
}
export function DataTable<TData, TValue>({
  columns,
  data,
  title,
  description,
  tableName,

  onEdit,
  onDelete,
  onExport,
  totalCount,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<TData | null>(null);
  const dataTablePermissions = usePermission(tableName);

  const actionColumn: ColumnDef<TData, TValue> = {
    id: "actions",
    enableHiding: false,
    accessorKey: "actions",
    header: ({}) => {
      const canEdit = dataTablePermissions.canUpdate;
      const canDelete = dataTablePermissions.canDelete;

      if (!canEdit && !canDelete) return null;
      return <HeaderComponent titulo="Acciones" />;
    },
    cell: ({ row }) => {
      const canEdit = dataTablePermissions.canUpdate;
      const canDelete = dataTablePermissions.canDelete;

      if (!canEdit && !canDelete) return null;
      return (
        <div className="flex items-center justify-center gap-2 min-h-[40px]">
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              className="min-h-[40px] text-primary"
              onClick={() => onEdit && onEdit(row.original)}
            >
              Editar
            </Button>
          )}
          {canDelete && (
            <Button
              onClick={() => handleDeleteSingle(row.original)}
              className="min-h-[40px] text-destructive"
              variant="outline"
              size="sm"
            >
              Eliminar
            </Button>
          )}
        </div>
      );
    },
  };

  const enhancedColumns = useMemo(() => {
    return [...columns, actionColumn];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns]);

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  const handleDeleteSingle = (item: TData) => {
    setItemsToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (onDelete) {
      if (itemsToDelete) {
        onDelete(itemsToDelete);
      }
      setRowSelection({});
    }
    setDeleteDialogOpen(false);
    setItemsToDelete(null);
  };

  const handleExport = (format: "csv" | "excel" | "json" | "pdf") => {
    if (onExport) {
      const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original);
      const rowsToExport = selectedRows.length > 0 ? selectedRows : data;
      onExport(format, rowsToExport);
    }
  };

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">{title}</CardTitle>
              {description && (
                <CardDescription className="mt-2">
                  {description}
                </CardDescription>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {totalCount && (
                <Badge variant="secondary" className="text-sm">
                  {`${totalCount} registros`}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4 space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="min-h-[40px]">
                  <Filter className="mr-2 h-4 w-4" />
                  Columnas
                  <ChevronDown className="mr-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>

            {dataTablePermissions.canUpdate && (
              <ExportDropdown
                onExport={handleExport}
                selectedCount={selectedCount}
                totalCount={data.length}
                disabled={data.length === 0}
              />
            )}
          </div>
          <div className="overflow-x-auto rounded-md border">
            <Table className="min-w-full">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="font-semibold">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <Fragment key={row.id}>
                      <TableRow
                        data-state={row.getIsSelected() && "selected"}
                        className="hover:bg-accent/50"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    </Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={enhancedColumns.length}
                      className="h-24 text-center"
                    >
                      No se encontraron resultados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4">
            {" "}
            <div className="flex-1 text-sm text-muted-foreground">
              {`${table.getFilteredSelectedRowModel().rows.length} de ${table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).`}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Filas por página</p>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value));
                  }}
                  className="h-8 w-[70px] rounded border border-input bg-background px-2 text-sm"
                >
                  {[10, 20, 30, 40, 50, 100].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                {`Página ${table.getState().pagination.pageIndex + 1} de ${table.getPageCount()}`}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Ir a la primera página</span>
                  {"<<"}
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0 bg-transparent"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Ir a la página anterior</span>
                  {"<"}
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0 bg-transparent"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Ir a la página siguiente</span>
                  {">"}
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Ir a la última página</span>
                  {">>"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </>
  );
}

// Sortable header component
export function SortableHeader({
  column,
  children,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  column: any;
  children: ReactNode;
}) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="h-auto p-0 font-semibold hover:bg-transparent"
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}
