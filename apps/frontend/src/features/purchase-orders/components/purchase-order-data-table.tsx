//src/features/purchase-orders/components/purchase-order-data-table.tsx
"use client";

import {
  DataTable,
  FloatingActionButton,
  SlideOverForm,
} from "@/components/data-display/data-table";
import { purchaseOrderColumns } from "./columns";
import {
  useCreatePurchaseOrder,
  useDeletePurchaseOrder,
  usePurchaseOrders,
  useUpdatePurchaseOrder,
} from "../hooks/hooks";
import { PurchaseOrder } from "../types";

import { useDataTableActions } from "@/hooks/useDataTable";
import { PurchaseOrderForm } from "./purchase-order-form";
import { useState } from "react";

export function PurchaseOrdersDataTable() {
  const { data: purchaseOrders = [] } = usePurchaseOrders();

  const [slideOverOpen, setSlideOverOpen] = useState(false);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] =
    useState<PurchaseOrder | null>(null);
  const [formData, setFormData] = useState<Partial<PurchaseOrder>>({});

  const createPurchaseOrder = useCreatePurchaseOrder();
  const updatePurchaseOrder = useUpdatePurchaseOrder();
  const deletePurchaseOrder = useDeletePurchaseOrder();

  const {} = useDataTableActions<PurchaseOrder>({
    entityName: "Órdenes de Compra",
    onDelete: (id) => deletePurchaseOrder.mutateAsync(id),
  });

  const handleEdit = (row: PurchaseOrder) => {
    setSelectedPurchaseOrder(row);
    setFormData(row);
    setSlideOverOpen(true);
  };

  const handleAdd = () => {
    setSelectedPurchaseOrder(null);
    setFormData({
      orderNumber: "",
      supplier: "",
      items: 0,
      totalAmount: 0,
      status: "pending",
      orderDate: "",
      deliveryDate: "",
    });
    setSlideOverOpen(true);
  };
  const handleDelete = (rows: PurchaseOrder[]) => {
    console.log("Delete Purchase Orders:", rows);
  };

  const handleExport = (
    format: "csv" | "excel" | "json" | "pdf",
    selectedRows: PurchaseOrder[],
  ) => {
    console.log("Export Purchase Orders:", selectedRows);
  };

  const handleSave = async () => {
    if (selectedPurchaseOrder) {
      await updatePurchaseOrder.mutateAsync({
        id: selectedPurchaseOrder.id,
        purchaseOrderUpdate: formData,
      });
      setSlideOverOpen(false);
    }
  };

  return (
    <>
      <DataTable
        columns={purchaseOrderColumns}
        data={purchaseOrders}
        title="Órdenes de Compra"
        description="Gestión y seguimiento de órdenes de compra"
        tableName="purchase_orders"
        totalCount={purchaseOrders.length}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
        onQuickEdit={(purchaseOrder) =>
          console.log(`Quick edit purchase order: ${purchaseOrder.orderNumber}`)
        }
      />

      <FloatingActionButton
        onClick={handleAdd}
        label="Añadir nueva orden de compra"
      />

      <SlideOverForm
        open={slideOverOpen}
        onOpenChange={setSlideOverOpen}
        title={
          selectedPurchaseOrder
            ? `Editar orden de compra: ${selectedPurchaseOrder.orderNumber}`
            : "Crear nueva orden de compra"
        }
        description={
          selectedPurchaseOrder
            ? `Edita los detalles de la orden de compra ${selectedPurchaseOrder.orderNumber}.`
            : "Rellena los campos para crear una nueva orden de compra."
        }
        onSave={handleSave}
        onCancel={() => setSlideOverOpen(false)}
        saveLabel={selectedPurchaseOrder ? "Actualizar" : "Crear"}
      >
        <div className="space-y-2">
          <PurchaseOrderForm
            onSubmit={handleSave}
            onCancel={() => setSlideOverOpen(false)}
            isSubmitting={createPurchaseOrder.isPending}
          />
        </div>
      </SlideOverForm>
    </>
  );
}
