//src/features/plants/components/plants-data-table.tsx
"use client";

import {
  DataTable,
  FloatingActionButton,
  SlideOverForm,
} from "@/components/data-display/data-table";
import { plantColumns } from "./columns";
import {
  useCreatePlant,
  useDeletePlant,
  usePlants,
  useUpdatePlant,
} from "../hooks/hooks";
import { Plant } from "../types";

import { useDataTableActions } from "@/hooks/useDataTable";
import { PlantForm } from "./plants-form";
import { useState } from "react";

export function PlantsDataTable() {
  const { data: plants = [] } = usePlants();

  const [slideOverOpen, setSlideOverOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [formData, setFormData] = useState<Partial<Plant>>({});

  const createPlant = useCreatePlant();
  const updatePlant = useUpdatePlant();
  const deletePlant = useDeletePlant();

  const {} = useDataTableActions<Plant>({
    entityName: "Plants",
    onDelete: (id) => deletePlant.mutateAsync(id),
  });

  const handleEdit = (row: Plant) => {
    setSelectedPlant(row);
    setFormData(row);
    setSlideOverOpen(true);
  };

  const handleAdd = () => {
    setSelectedPlant(null);
    setFormData({
      name: "",
      species: "",
      location: "",
      status: "healthy",
      growthStage: "",
      plantedDate: "",
      lastWatered: "",
    });
    setSlideOverOpen(true);
  };
  const handleDelete = (rows: Plant[]) => {
    console.log("Delete Plants:", rows);
  };

  const handleExport = (
    format: "csv" | "excel" | "json" | "pdf",
    selectedRows: Plant[],
  ) => {
    console.log("Export Plants:", selectedRows);
  };

  const handleSave = async () => {
    if (selectedPlant) {
      await updatePlant.mutateAsync({
        id: selectedPlant.id,
        plantUpdate: formData,
      });
      setSlideOverOpen(false);
    }
  };
  return (
    <>
      <DataTable
        columns={plantColumns}
        data={plants}
        title="Plantas"
        description="Gestión de la información de las plantas"
        tableName="plants"
        totalCount={plants.length}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
        onQuickEdit={(plant) => console.log(`Quick edit plant: ${plant.name}`)}
      />

      <FloatingActionButton onClick={handleAdd} label="Añadir nueva planta" />
      <SlideOverForm
        open={slideOverOpen}
        onOpenChange={setSlideOverOpen}
        title={
          selectedPlant
            ? `Editar planta: ${selectedPlant.name}`
            : "Crear nueva planta"
        }
        description={
          selectedPlant
            ? `Edita los detalles de la planta ${selectedPlant.name}.`
            : "Rellena los campos para crear una nueva planta."
        }
        onSave={handleSave}
        onCancel={() => setSlideOverOpen(false)}
        saveLabel={selectedPlant ? "Actualizar" : "Crear"}
      >
        <div className="space-y-2">
          <PlantForm
            onSubmit={handleSave}
            onCancel={() => setSlideOverOpen(false)}
            isSubmitting={createPlant.isPending}
          />
        </div>
      </SlideOverForm>
    </>
  );
}
