//src/features/users/components/user-data-table.tsx
"use client";

import { useDataTableActions } from "@/hooks/useDataTable";
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUsers,
  useUsersByUserName,
  useUsersByTenantId,
} from "../hooks/useUsers";

import {
  DataTable,
  FloatingActionButton,
  SlideOverForm,
} from "@/components/data-display/data-table";
import { userColumns } from "./columns";
import { UserForm } from "./user-form";
import { useEffect, useState } from "react";
import { UpdateUserProfileDto, UserProfileDto } from "@vivero/shared";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { usePermission } from "@/hooks/usePermission";

export function UsersDataTable() {
  const canCreate = usePermission("users").canCreate;
  const { data: users = [] } = useUsers();

  const [slideOverOpen, setSlideOverOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfileDto>();
  const [formData, setFormData] = useState<Partial<UpdateUserProfileDto>>({});

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const {} = useDataTableActions<UserProfileDto>({
    entityName: "Usuarios",
    onDelete: (id) => deleteUser.mutateAsync(id),
  });

  const handleEdit = (row: UserProfileDto) => {
    setSelectedUser(row);
    setFormData({
      firstName: row.firstName || "",
      lastName: row.lastName || "",
      email: row.email || "",
      passwordHash: row.passwordHash || "",
    });
    setSlideOverOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      passwordHash: "",
    });
    setSlideOverOpen(true);
  };
  const handleDelete = (rows: UserProfileDto[]) => {
    console.log("Delete Users:", rows);
  };

  const handleExport = (
    format: "csv" | "excel" | "json" | "pdf",
    selectedRows: UserProfileDto[],
  ) => {
    console.log("Export Users:", selectedRows);
  };

  const handleSave = async () => {
    if (selectedUser) {
      await updateUser.mutateAsync({
        id: selectedUser.id,
        userUpdate: formData,
      });
      setSlideOverOpen(false);
    }
  };

  return (
    <>
      <DataTable
        columns={userColumns}
        data={users}
        title="Usuarios"
        description="Gestión de los usuarios del sistema"
        tableName="users"
        totalCount={users.length}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
        onQuickEdit={(user) => console.log(`Quick edit user: ${user.username}`)}
      />
      {}
      {canCreate && (
        <FloatingActionButton
          onClick={handleAdd}
          label="Añadir nuevo usuario"
        />
      )}

      <SlideOverForm
        open={slideOverOpen}
        onOpenChange={setSlideOverOpen}
        title={
          selectedUser
            ? `Editar usuario: ${selectedUser.username}`
            : "Crear nuevo usuario"
        }
        description={
          selectedUser
            ? `Edita los detalles del usuario ${selectedUser.username}.`
            : "Rellena los campos para crear un nuevo usuario."
        }
        onSave={handleSave}
        onCancel={() => setSlideOverOpen(false)}
        saveLabel={selectedUser ? "Actualizar" : "Crear"}
      >
        <div className="space-y-2">
          <UserForm
            initialData={selectedUser}
            onSubmit={handleSave}
            onCancel={() => setSlideOverOpen(false)}
            isSubmitting={createUser.isPending}
          />
        </div>
      </SlideOverForm>
    </>
  );
}
