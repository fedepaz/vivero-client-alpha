// shared/src/schemas/user.schema.ts

import { z } from "zod";

export const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  passwordHash: z.string().optional(),
  isActive: z.boolean(),
  tenantId: z.string(),
  roleId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserProfileDto = z.infer<typeof UserProfileSchema>;

export const UpdateUserProfileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
});

export type UpdateUserProfileDto = z.infer<typeof UpdateUserProfileSchema>;
