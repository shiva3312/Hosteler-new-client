import { z } from 'zod';
import { Primitive } from '../primitive.class';
import { UserActionResponseZodSchema } from '../common.interface';

export const BillingRequestZodSchema = z.object({
  // reference fields
  unit: Primitive.safeID().nullish(),
  organization: Primitive.safeID().nullish(),
});

export const BillingResponseZodSchema = z.object({
  _id: Primitive.safeID(),
  createdAt: Primitive.safeDate(),
  updatedAt: Primitive.safeDate(),
  history: z.array(UserActionResponseZodSchema).optional(), // array of user actions on this menu
});

export const UpdateBillingRequestZodSchema = BillingRequestZodSchema.partial();

/* ---------- TypeScript Types ---------- */

export type BillingRequest = z.infer<typeof BillingRequestZodSchema>;
export type BillingResponse = z.infer<typeof BillingResponseZodSchema>;
export type UpdateBillingRequest = z.infer<typeof UpdateBillingRequestZodSchema>;
