//src/features/users/components/user-data-table.tsx
"use client";

import { useDataTableActions } from "@/hooks/useDataTable";
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUsers,
} from "../hooks/hooks";

import {
  DataTable,
  FloatingActionButton,
  SlideOverForm,
} from "@/components/data-display/data-table";
import { userColumns } from "./columns";
import { UserForm } from "./user-form";
import { useState } from "react";
import { User } from "../types";

export function UsersDataTable() {
  const { data: users = [] } = useUsers();
  const t = "UsersDataTable";

  const [slideOverOpen, setSlideOverOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const {} = useDataTableActions<User>({
    entityName: t("entityName"),
    onDelete: (id) => deleteUser.mutateAsync(id),
  });

  const handleEdit = (row: User) => {
    setSelectedUser(row);
    setFormData(row);
    setSlideOverOpen(true);
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setFormData({
      name: "",
      email: "",
      role: "manager",
      department: "",
      status: "active",
    });
    setSlideOverOpen(true);
  };
  const handleDelete = (rows: User[]) => {
    console.log("Delete Users:", rows);
  };

  const handleExport = (
    format: "csv" | "excel" | "json" | "pdf",
    selectedRows: User[],
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
        title={t("title")}
        description={t("description")}
        searchKey="name"
        totalCount={users.length}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
        onQuickEdit={(user) => console.log(`Quick edit user: ${user.name}`)}
      />
      <FloatingActionButton onClick={handleAdd} label={t("addNew")} />

      <SlideOverForm
        open={slideOverOpen}
        onOpenChange={setSlideOverOpen}
        title={
          selectedUser
            ? t("editTitle", { name: selectedUser.name })
            : t("createTitle")
        }
        description={
          selectedUser
            ? t("editDescription", { name: selectedUser.name })
            : t("createUserDescription")
        }
        onSave={handleSave}
        onCancel={() => setSlideOverOpen(false)}
        saveLabel={selectedUser ? t("updateButton") : t("createButton")}
      >
        <div className="space-y-2">
          <UserForm
            onSubmit={handleSave}
            onCancel={() => setSlideOverOpen(false)}
            isSubmitting={createUser.isPending}
          />
        </div>
      </SlideOverForm>
    </>
  );
}
