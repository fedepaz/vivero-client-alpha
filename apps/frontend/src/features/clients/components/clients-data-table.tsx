//src/features/clients/components/clients-data-table.tsx
"use client";

import {
  DataTable,
  FloatingActionButton,
  SlideOverForm,
} from "@/components/data-display/data-table";
import { clientColumns } from "./columns";
import {
  useClients,
  useCreateClient,
  useDeleteClient,
  useUpdateClient,
} from "../hooks/hooks";
import { Client } from "../types";

import { useDataTableActions } from "@/hooks/useDataTable";

import { ClientForm } from "./client-form";
import { useState } from "react";
import { RenderInlineEdit } from "./render-inline-edit";

export function ClientsDataTable() {
  const { data: clients = [] } = useClients();
  //const {toast} = useToast()

  const [slideOverOpen, setSlideOverOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<Partial<Client>>({});

  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const {} = useDataTableActions<Client>({
    entityName: "Clientes",
    onDelete: (id) => deleteClient.mutateAsync(id),
  });

  const handleEdit = (row: Client) => {
    setSelectedClient(row);
    setFormData(row);
    setSlideOverOpen(true);
  };

  const handleAdd = () => {
    setSelectedClient(null);
    setFormData({
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      status: "active",
      totalOrders: 0,
      totalRevenue: 0,
      lastOrder: "",
    });
    setSlideOverOpen(true);
  };
  const handleDelete = (rows: Client[]) => {
    console.log("Eliminar Clientes:", rows);
  };

  const handleExport = (
    format: "csv" | "excel" | "json" | "pdf",
    selectedRows: Client[],
  ) => {
    console.log("Exportar Clientes:", selectedRows);
  };

  const handleSave = async () => {
    if (selectedClient) {
      await updateClient.mutateAsync({
        id: selectedClient.id,
        clientUpdate: formData,
      });
      setSlideOverOpen(false);
    }
  };

  return (
    <>
      <DataTable
        columns={clientColumns}
        data={clients}
        title="Clientes"
        description="Gestión de la información de los clientes"
        searchKey="name"
        totalCount={clients.length}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
        renderInlineEdit={RenderInlineEdit}
        onQuickEdit={(client) =>
          console.log(`Edición rápida de cliente: ${client.name}`)
        }
      />
      <FloatingActionButton onClick={handleAdd} label="Añadir nuevo cliente" />

      <SlideOverForm
        open={slideOverOpen}
        onOpenChange={setSlideOverOpen}
        title={
          selectedClient
            ? `Editar cliente: ${selectedClient.name}`
            : "Crear nuevo cliente"
        }
        description={
          selectedClient
            ? `Edita los detalles del cliente ${selectedClient.name}.`
            : "Rellena los campos para crear un nuevo cliente."
        }
        onSave={handleSave}
        onCancel={() => setSlideOverOpen(false)}
        saveLabel={selectedClient ? "Actualizar" : "Crear"}
      >
        <div className="space-y-2">
          <ClientForm
            onSubmit={handleSave}
            onCancel={() => setSlideOverOpen(false)}
            isSubmitting={createClient.isPending}
          />
        </div>
      </SlideOverForm>
    </>
  );
}
