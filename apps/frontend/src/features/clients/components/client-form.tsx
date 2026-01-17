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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Client, ClientFormData, clientSchema } from "../types";

interface ClientFormProps {
  initialData?: Client;
  onSubmit: (data: ClientFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ClientForm({ initialData, onSubmit }: ClientFormProps) {
  const t = "ClientForm";
  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: initialData
      ? initialData
      : {
          name: "",
          contactPerson: "",
          email: "",
          phone: "",
          status: "active",
          totalOrders: 0,
          totalRevenue: 0,
          lastOrder: "",
        },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("nameLabel")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("namePlaceholder")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactPerson"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("contactPersonLabel")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("contactPersonPlaceholder")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("emailLabel")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("emailPlaceholder")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("phoneLabel")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("phonePlaceholder")} />
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
                  <SelectItem value="active">{t("activeStatus")}</SelectItem>
                  <SelectItem value="inactive">
                    {t("inactiveStatus")}
                  </SelectItem>
                  <SelectItem value="prospect">
                    {t("prospectStatus")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
