//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { z } from 'zod';

import { Unit } from '../enums';
import { Primitive } from '../primitive.class';

export const IngredientRequestZodSchema = z.object({
  name: Primitive.safeString(),
  unitType: z.nativeEnum(Unit),
  quantity: Primitive.safeNumber(),
  threshold: Primitive.safeNumber(),
  pricePerUnit: Primitive.safeNumber(),
  image: Primitive.safeString('Image URL').nullish(),
  description: Primitive.safeString().nullish(),

  // reference fields
  supplierId: Primitive.safeID().nullish(), // optional reference to a supplier
  unit: Primitive.safeID().nullish(),
  organization: Primitive.safeID().nullish(),
});

export const IngredientResponseZodSchema = z.object({
  _id: Primitive.safeID(),
  createdAt: Primitive.safeDate(),
  updatedAt: Primitive.safeDate(),
});

export const UpdateIngredientRequestZodSchema =
  IngredientRequestZodSchema.partial();

/* ---------- TypeScript Types ---------- */

export type IngredientRequest = z.infer<typeof IngredientRequestZodSchema>;
export type IngredientResponse = z.infer<typeof IngredientResponseZodSchema>;
export type UpdateIngredientRequest = z.infer<
  typeof UpdateIngredientRequestZodSchema
>;
