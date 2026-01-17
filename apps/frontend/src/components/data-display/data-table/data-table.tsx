import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  Row,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, Search, Filter, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
import { InlineEditRow } from "./inline-edit-row";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title: string;
  description?: string;
  searchKey?: string;
  onEdit?: (row: TData) => void;
  onDelete?: (rows: TData[]) => void;
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
  ) => React.ReactNode;
  onQuickEdit?: (row: TData) => void;
}

interface HeaderProps {
  translationKey: string;
}

function HeaderComponent({ translationKey }: HeaderProps) {
  console.log(t(translationKey));
  return (
    <div className="items-center justify-between">
      <div className="text-center">{t(translationKey)}</div>
    </div>
  );
}
export function DataTable<TData, TValue>({
  columns,
  data,
  title,
  description,

  onEdit,
  onDelete,
  onExport,
  totalCount,
  renderInlineEdit,
  onQuickEdit,
}: DataTableProps<TData, TValue>) {
  const t = "DataTable";
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [itemsToDelete, setItemsToDelete] = React.useState<TData[]>([]);

  const actionColumn: ColumnDef<TData, TValue> = {
    id: "actions",
    enableHiding: false,
    accessorKey: "actions",
    header: ({}) => {
      return <HeaderComponent translationKey="actions" />;
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              className="min-h-[40px]"
              onClick={() => onEdit(row.original)}
            >
              {t("edit")}
            </Button>
          )}
          {onDelete && (
            <Button
              onClick={() => handleDeleteSingle(row.original)}
              className="min-h-[40px] "
              variant="secondary"
              size="sm"
            >
              {t("delete")}
            </Button>
          )}
        </div>
      );
    },
  };

  const enhancedColumns = React.useMemo(() => {
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

  const handleQuickEdit = (row: Row<TData>) => {
    const rowId = row.id;
    if (expandedRow === rowId) {
      setExpandedRow(null);
    } else {
      setExpandedRow(rowId);
      if (onQuickEdit) {
        onQuickEdit(row.original);
      }
    }
  };

  const handleDeleteSingle = (item: TData) => {
    setItemsToDelete([item]);
    setDeleteDialogOpen(true);
  };

  const handleBulkDelete = () => {
    const selectedRows = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original);
    setItemsToDelete(selectedRows);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (onDelete && itemsToDelete.length > 0) {
      onDelete(itemsToDelete);
      setRowSelection({});
    }
    setDeleteDialogOpen(false);
    setItemsToDelete([]);
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
                  {t("records", { count: totalCount })}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4 space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchPlaceholder", {
                  title: title.toLowerCase(),
                })}
                value={globalFilter ?? ""}
                onChange={(event) =>
                  setGlobalFilter(String(event.target.value))
                }
                className="pl-8"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="min-h-[40px]">
                  <Filter className="mr-2 h-4 w-4" />
                  {t("columns.title")}
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
                        {t(`columns.${column.id}`)}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>

            {onExport && (
              <ExportDropdown
                onExport={handleExport}
                selectedCount={selectedCount}
                totalCount={data.length}
                disabled={data.length === 0}
              />
            )}
            {selectedCount > 0 && onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t("delete")} ({selectedCount})
              </Button>
            )}
          </div>
          <div className="rounded-md border">
            <Table>
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
                    <React.Fragment key={row.id}>
                      <TableRow
                        data-state={row.getIsSelected() && "selected"}
                        className="hover:bg-accent/50"
                        onClick={(e) => {
                          const target = e.target as HTMLElement;
                          if (
                            !target.closest("button") &&
                            !target.closest('[role="checkbox"]')
                          ) {
                            handleQuickEdit(row);
                          }
                        }}
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
                      {renderInlineEdit && (
                        <InlineEditRow
                          isExpanded={expandedRow === row.id}
                          onToggle={() => setExpandedRow(null)}
                          onMoreDetails={() => onEdit && onEdit(row.original)}
                          colSpan={enhancedColumns.length}
                        >
                          {renderInlineEdit(
                            row.original,
                            () => setExpandedRow(null),
                            () => setExpandedRow(null),
                          )}
                        </InlineEditRow>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={enhancedColumns.length}
                      className="h-24 text-center"
                    >
                      {t("noResultsFound")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {t("rowsSelected", {
                selected: table.getFilteredSelectedRowModel().rows.length,
                total: table.getFilteredRowModel().rows.length,
              })}
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">{t("rowsPerPage")}</p>
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
                {t("pageInfo", {
                  currentPage: table.getState().pagination.pageIndex + 1,
                  pageCount: table.getPageCount(),
                })}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">{t("goToFirstPage")}</span>
                  {"<<"}
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0 bg-transparent"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">{t("goToPreviousPage")}</span>
                  {"<"}
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0 bg-transparent"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">{t("goToNextPage")}</span>
                  {">"}
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">{t("goToLastPage")}</span>
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
        itemCount={itemsToDelete.length}
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
  children: React.ReactNode;
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
