//src/features/plants/components/plants-form.tsx

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
import { Plant, PlantFormData, plantSchema } from "../types";

interface PlantFormProps {
  initialData?: Plant;
  onSubmit: (data: PlantFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function PlantForm({ initialData, onSubmit }: PlantFormProps) {
  const t = "PlantForm";
  const form = useForm<PlantFormData>({
    resolver: zodResolver(plantSchema),
    defaultValues: initialData
      ? initialData
      : {
          name: "",
          species: "",
          location: "",
          status: "healthy",
          growthStage: "",
          plantedDate: new Date().toISOString().split("T")[0],
          lastWatered: new Date().toISOString().split("T")[0],
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
          name="species"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("speciesLabel")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("speciesPlaceholder")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("locationLabel")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("locationPlaceholder")} />
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
              <FormControl>
                <Input {...field} placeholder={t("statusPlaceholder")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="growthStage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("growthStageLabel")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("growthStagePlaceholder")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="plantedDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("plantedDateLabel")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("plantedDatePlaceholder")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastWatered"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("lastWateredLabel")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("lastWateredPlaceholder")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
