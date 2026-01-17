import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  PurchaseOrder,
  PurchaseOrderFormData,
  purchaseOrderSchema,
} from "../types";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PurchaseOrderFormProps {
  initialData?: PurchaseOrder;
  onSubmit: (data: PurchaseOrderFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function PurchaseOrderForm({
  initialData,
  onSubmit,
}: PurchaseOrderFormProps) {
  const t = "PurchaseOrderForm";
  const form = useForm<PurchaseOrderFormData>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: initialData
      ? initialData
      : {
          orderNumber: "",
          supplier: "",
          items: 0,
          totalAmount: 0,
          status: "pending",
          orderDate: new Date().toISOString().split("T")[0],
          deliveryDate: new Date().toISOString().split("T")[0],
        },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="orderNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("orderNumberLabel")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("orderNumberPlaceholder")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="supplier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("supplierLabel")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("supplierPlaceholder")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="items"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("itemsLabel")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  placeholder={t("itemsPlaceholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="totalAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("totalAmountLabel")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  placeholder={t("totalAmountPlaceholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("statusLabel")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectStatusPlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pending">{t("pendingStatus")}</SelectItem>
                  <SelectItem value="approved">
                    {t("approvedStatus")}
                  </SelectItem>
                  <SelectItem value="received">
                    {t("receivedStatus")}
                  </SelectItem>
                  <SelectItem value="cancelled">
                    {t("cancelledStatus")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="orderDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("orderDateLabel")}</FormLabel>
              <FormControl>
                <Input {...field} type="date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deliveryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("deliveryDateLabel")}</FormLabel>
              <FormControl>
                <Input {...field} type="date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
