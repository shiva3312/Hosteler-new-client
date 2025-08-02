//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { z } from 'zod';

import { UserActionZodSchema } from '../common.interface';
import { Primitive } from '../primitive.class';

export const PurchaseRequestZodSchema = z.object({
  // reference fields
  unit: Primitive.safeID().nullish(),
  organization: Primitive.safeID().nullish(),
});

export const PurchaseResponseZodSchema = z.object({
  _id: Primitive.safeID(),
  createdAt: Primitive.safeDate(),
  updatedAt: Primitive.safeDate(),
  // array of user actions on this menu
});

export const UpdatePurchaseRequestZodSchema =
  PurchaseRequestZodSchema.partial();

/* ---------- TypeScript Types ---------- */

export type PurchaseRequest = z.infer<typeof PurchaseRequestZodSchema>;
export type PurchaseResponse = z.infer<typeof PurchaseResponseZodSchema>;
export type UpdatePurchaseRequest = z.infer<
  typeof UpdatePurchaseRequestZodSchema
>;
