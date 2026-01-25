// shared/src/schemas/enums.schema.ts
import { z } from "zod";

export const AuditActionTypeSchema = z.enum([
  "CREATE",
  "UPDATE",
  "DELETE",
  "LOGIN",
  "LOGOUT",
  "ACCESS",
]);
export type AuditActionType = z.infer<typeof AuditActionTypeSchema>;

export const EntityTypeSchema = z.enum([
  "USER",
  "TENANT",
  "ROLE",
  "AUDIT_LOG",
  "LOCALE",
  "MESSAGE",
  "USER_PREFERENCE",
]);
export type EntityType = z.infer<typeof EntityTypeSchema>;
