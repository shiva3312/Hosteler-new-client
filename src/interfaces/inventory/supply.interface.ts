//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { z } from 'zod';

import { Unit } from '../enums';
import { Primitive } from '../primitive.class';

export const SupplyRequestZodSchema = z.object({
  name: Primitive.safeString(),
  unitType: z.nativeEnum(Unit),
  quantity: Primitive.safeNumber(),
  threshold: Primitive.safeNumber(),
  pricePerUnit: Primitive.safeNumber(),
  usageType: Primitive.safeString('Usage Type').nullish(), // e.g. 'cleaning', 'maintenance', 'office supplies', 'other' ..etc.
  image: Primitive.safeString('Image URL').nullish(),
  description: Primitive.safeString().nullish(),

  // reference fields
  supplierId: Primitive.safeID().nullish(), // optional reference to a supplier
  unit: Primitive.safeID().nullish(),
  organization: Primitive.safeID().nullish(),
});

export const SupplyResponseZodSchema = z.object({
  _id: Primitive.safeID(),
  createdAt: Primitive.safeDate(),
  updatedAt: Primitive.safeDate(),
});

export const UpdateSupplyRequestZodSchema = SupplyRequestZodSchema.partial();

/* ---------- TypeScript Types ---------- */

export type SupplyRequest = z.infer<typeof SupplyRequestZodSchema>;
export type SupplyResponse = z.infer<typeof SupplyResponseZodSchema>;
export type UpdateSupplyRequest = z.infer<typeof UpdateSupplyRequestZodSchema>;
