import { z } from "zod";

export const epicSchema = z.object({
  epic: z
    .string()
    .min(10, "EPIC number must be at least 10 characters")
    .max(10, "EPIC number must be exactly 10 characters")
    .regex(/^[A-Z]{3}[0-9]{7}$/, "Invalid EPIC format. Example: ABC1234567"),
});

export type EpicFormValues = z.infer<typeof epicSchema>;

export const chatMessageSchema = z.object({
  message: z.string().min(1).max(500),
});

export type ChatMessageValues = z.infer<typeof chatMessageSchema>;
