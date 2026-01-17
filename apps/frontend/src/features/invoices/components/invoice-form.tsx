//src/features/invoices/components/invoice-form.tsx

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
import { Invoice, InvoiceFormData, invoiceSchema } from "../types";

interface InvoiceFormProps {
  initialData?: Invoice;
  onSubmit: (data: InvoiceFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function InvoiceForm({ initialData, onSubmit }: InvoiceFormProps) {
  const t = "InvoiceForm";
  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: initialData
      ? initialData
      : {
          invoiceNumber: "",
          client: "",
          amount: 0,
          status: "draft",
          dueDate: new Date().toISOString().split("T")[0],
          createdDate: new Date().toISOString().split("T")[0],
        },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="invoiceNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("invoiceNumberLabel")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("invoiceNumberPlaceholder")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="client"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("clientLabel")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("clientPlaceholder")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("amountLabel")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
