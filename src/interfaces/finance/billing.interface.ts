//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { z } from 'zod';

import { Primitive } from '../primitive.class';

export const BillingRequestZodSchema = z.object({
  // reference fields
  unit: Primitive.safeID().nullish(),
  organization: Primitive.safeID().nullish(),
});

export const BillingResponseZodSchema = z.object({
  _id: Primitive.safeID(),
  createdAt: Primitive.safeDate(),
  updatedAt: Primitive.safeDate(),
});

export const UpdateBillingRequestZodSchema = BillingRequestZodSchema.partial();

/* ---------- TypeScript Types ---------- */

export type BillingRequest = z.infer<typeof BillingRequestZodSchema>;
export type BillingResponse = z.infer<typeof BillingResponseZodSchema>;
export type UpdateBillingRequest = z.infer<
  typeof UpdateBillingRequestZodSchema
>;
