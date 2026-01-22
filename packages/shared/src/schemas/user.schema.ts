// shared/src/schemas/user.schema.ts

import { z } from "zod";

export const UserProfileSchema = z.object({
  id: z.string(),
  username: z.string().min(1, { message: "Nombre de usuario es obligatorio" }),
  email: z.string().email().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  passwordHash: z.string().optional(),
  isActive: z.boolean(),
  tenantId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserProfileDto = z.infer<typeof UserProfileSchema>;

export const UpdateUserProfileSchema = z.object({
  firstName: z
    .string()
    .min(1)
    .max(50, { message: "Nombre de usuario máximo 50 caracteres" })
    .optional(),
  lastName: z
    .string()
    .min(1)
    .max(50, { message: "Apellido máximo 50 caracteres" })
    .optional(),
  passwordHash: z
    .string()
    .min(1, { message: "Contraseña es obligatoria, mínimo 4 caracteres" })
    .max(12, { message: "Contraseña es obligatoria, máximo 12 caracteres" })
    .optional(),
  email: z.string().email({ message: "Email no válido" }).optional(),
});

export type UpdateUserProfileDto = z.infer<typeof UpdateUserProfileSchema>;
