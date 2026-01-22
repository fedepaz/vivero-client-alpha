import { z } from "zod";

export const MessageSchema = z.object({
  id: z.string().min(1), // e.g., "common.greeting"
  value: z.string().min(1),
});

export type Message = z.infer<typeof MessageSchema>;
