// src/features/clients/components/render-inline-edit.tsx

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Client } from "../types";

export const RenderInlineEdit = (
  client: Client,
  onSave: () => void,
  onCancel: () => void,
) => {
  const t = "CellComponent";

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">{t("name")}</Label>
        <Input
          id="name"
          placeholder={t("namePlaceholder")}
          value={client.name}
          onChange={(e) => console.log(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contactPerson">{t("contactPerson")}</Label>
        <Input
          id="contactPerson"
          placeholder={t("contactPersonPlaceholder")}
          value={client.contactPerson}
          onChange={(e) => console.log(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          placeholder={t("emailPlaceholder")}
          value={client.email}
          onChange={(e) => console.log(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">{t("phone")}</Label>
        <Input
          id="phone"
          placeholder={t("phonePlaceholder")}
          value={client.phone}
          onChange={(e) => console.log(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">{t("status")}</Label>
        <Select
          defaultValue={client.status}
          onValueChange={(value) => console.log(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("statusPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">{t("active")}</SelectItem>
            <SelectItem value="inactive">{t("inactive")}</SelectItem>
            <SelectItem value="prospect">{t("prospect")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="totalOrders">{t("totalOrders")}</Label>
        <Input
          id="totalOrders"
          placeholder={t("totalOrdersPlaceholder")}
          value={client.totalOrders}
          onChange={(e) => console.log(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="totalRevenue">{t("totalRevenue")}</Label>
        <Input
          id="totalRevenue"
          placeholder={t("totalRevenuePlaceholder")}
          value={client.totalRevenue}
          onChange={(e) => console.log(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastOrder">{t("lastOrder")}</Label>
        <Input
          id="lastOrder"
          placeholder={t("lastOrderPlaceholder")}
          value={client.lastOrder}
          onChange={(e) => console.log(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-3">
        <button onClick={onCancel}>{t("cancel")}</button>
        <button onClick={onSave}>{t("save")}</button>
      </div>
    </>
  );
};
