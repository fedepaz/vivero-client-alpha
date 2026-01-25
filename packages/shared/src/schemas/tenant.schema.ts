// shared/src/schemas/tenant.schema.ts

import { z } from "zod";

export const TenantSchema = z.object({
  id: z.string(),
  name: z.string(),
  users: z.array(z.string()),
  auditLogs: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Tenant = z.infer<typeof TenantSchema>;
