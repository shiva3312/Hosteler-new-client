import { z } from 'zod';
import { Primitive } from '../primitive.class';
import { UserActionResponseZodSchema } from '../common.interface';

export const SalesRequestZodSchema = z.object({
  // reference fields
  unit: Primitive.safeID().nullish(),
  organization: Primitive.safeID().nullish(),
});

export const SalesResponseZodSchema = z.object({
  _id: Primitive.safeID(),
  createdAt: Primitive.safeDate(),
  updatedAt: Primitive.safeDate(),
  history: z.array(UserActionResponseZodSchema).optional(), // array of user actions on this menu
});

export const UpdateSalesRequestZodSchema = SalesRequestZodSchema.partial();

/* ---------- TypeScript Types ---------- */

export type SalesRequest = z.infer<typeof SalesRequestZodSchema>;
export type SalesResponse = z.infer<typeof SalesResponseZodSchema>;
export type UpdateSalesRequest = z.infer<typeof UpdateSalesRequestZodSchema>;
