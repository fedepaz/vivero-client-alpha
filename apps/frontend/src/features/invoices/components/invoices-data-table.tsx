//src/features/invoices/components/invoices-data-table.tsx
"use client";

import {
  DataTable,
  FloatingActionButton,
  SlideOverForm,
} from "@/components/data-display/data-table";
import { invoiceColumns } from "./columns";
import {
  useCreateInvoice,
  useDeleteInvoice,
  useInvoices,
  useUpdateInvoice,
} from "../hooks/hooks";
import { Invoice } from "../types";
import { useDataTableActions } from "@/hooks/useDataTable";

import { InvoiceForm } from "./invoice-form";
import { useState } from "react";

export function InvoicesDataTable() {
  const { data: invoices = [] } = useInvoices();
  const t = "InvoicesDataTable";

  const [slideOverOpen, setSlideOverOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [formData, setFormData] = useState<Partial<Invoice>>({});

  const createInvoice = useCreateInvoice();
  const updateInvoice = useUpdateInvoice();
  const deleteInvoice = useDeleteInvoice();

  const {} = useDataTableActions<Invoice>({
    entityName: "Invoices",
    onDelete: (id) => deleteInvoice.mutateAsync(id),
  });

  const handleEdit = (row: Invoice) => {
    setSelectedInvoice(row);
    setFormData(row);
    setSlideOverOpen(true);
  };

  const handleAdd = () => {
    setSelectedInvoice(null);
    setFormData({
      invoiceNumber: "",
      client: "",
      amount: 0,
      status: "draft",
      dueDate: "",
      createdDate: "",
    });
    setSlideOverOpen(true);
  };
  const handleDelete = (rows: Invoice[]) => {
    console.log("Delete Invoices:", rows);
  };

  const handleExport = (
    format: "csv" | "excel" | "json" | "pdf",
    selectedRows: Invoice[],
  ) => {
    console.log("Export Invoices:", selectedRows);
  };

  const handleSave = async () => {
    if (selectedInvoice) {
      await updateInvoice.mutateAsync({
        id: selectedInvoice.id,
        invoiceUpdate: formData,
      });
      setSlideOverOpen(false);
    }
  };

  return (
    <>
      <DataTable
        columns={invoiceColumns}
        data={invoices}
        title={t("title")}
        description={t("description")}
        searchKey="invoiceNumber"
        totalCount={invoices.length}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
        onQuickEdit={(invoice) =>
          console.log(`Quick edit invoice: ${invoice.invoiceNumber}`)
        }
      />

      <FloatingActionButton onClick={handleAdd} label={t("addNew")} />

      <SlideOverForm
        open={slideOverOpen}
        onOpenChange={setSlideOverOpen}
        title={
          selectedInvoice
            ? t("editInvoiceTitle", {
                invoiceNumber: selectedInvoice.invoiceNumber,
              })
            : t("createInvoiceTitle")
        }
        description={
          selectedInvoice
            ? t("editInvoiceDescription", {
                invoiceNumber: selectedInvoice.invoiceNumber,
              })
            : t("createInvoiceDescription")
        }
        onSave={handleSave}
        onCancel={() => setSlideOverOpen(false)}
        saveLabel={selectedInvoice ? t("update") : t("create")}
      >
        <div className="space-y-2">
          <InvoiceForm
            onSubmit={handleSave}
            onCancel={() => setSlideOverOpen(false)}
            isSubmitting={createInvoice.isPending}
          />
        </div>
      </SlideOverForm>
    </>
  );
}
