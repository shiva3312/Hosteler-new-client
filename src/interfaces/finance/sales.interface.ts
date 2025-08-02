//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { z } from 'zod';

import { Primitive } from '../primitive.class';

export const SalesRequestZodSchema = z.object({
  // reference fields
  unit: Primitive.safeID().nullish(),
  organization: Primitive.safeID().nullish(),
});

export const SalesResponseZodSchema = z.object({
  _id: Primitive.safeID(),
  createdAt: Primitive.safeDate(),
  updatedAt: Primitive.safeDate(),
});

export const UpdateSalesRequestZodSchema = SalesRequestZodSchema.partial();

/* ---------- TypeScript Types ---------- */

export type SalesRequest = z.infer<typeof SalesRequestZodSchema>;
export type SalesResponse = z.infer<typeof SalesResponseZodSchema>;
export type UpdateSalesRequest = z.infer<typeof UpdateSalesRequestZodSchema>;
