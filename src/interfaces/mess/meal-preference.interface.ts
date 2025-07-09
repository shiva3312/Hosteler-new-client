//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { z } from 'zod';

import {
  MetaZodSchema,
  UserActionResponseZodSchema,
} from '../common.interface';
import { Primitive } from '../primitive.class';

export const MealPreferenceRequestZodSchema = z.object({
  quantity: Primitive.safeNumber('Quantity', 0).optional(),
  interest: Primitive.safeNumber('Interest', 0).default(0), // rating given by the user for this meal preference, 0 means not rated
  priority: Primitive.safeNumber('Priority', 0).default(0), // priority of the meal preference, lower number means higher priority
  rating: Primitive.safeNumber('Rating', 0).default(0), // rating given by the user for this meal preference, 0 means not rated

  // reference fields
  meal: Primitive.safeID().nullish(), // id of the meal item
  user: Primitive.safeID().nullish(), // array of user ids
  unit: Primitive.safeID().nullish(), // array of unit ids
  organization: Primitive.safeID().nullish(), // organization id
});

export const MealPreferenceResponseZodSchema = z
  .object({
    _id: Primitive.safeID(),
    createdAt: Primitive.safeDate(),
    updatedAt: Primitive.safeDate(),
    history: z.array(UserActionResponseZodSchema).optional(), // array of user actions on this menu
  })
  .merge(MealPreferenceRequestZodSchema)
  .extend({
    meta: MetaZodSchema.optional(),
    // meal: z.lazy(() => {
    //   const MealItemResponseZodSchema = require('./meal-item.interface').MealItemResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
    //   return MealItemResponseZodSchema.optional();
    // }),
    // user: z.lazy(() => {
    //   const UserResponseZodSchema = require('./user.interface').UserResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
    //   return UserResponseZodSchema.optional();
    // }),
    // unit: z.lazy(() => {
    //   const UnitResponseZodSchema = require('./unit.interface').UnitResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
    //   return UnitResponseZodSchema.nullish();
    // }),
    // organization: z.lazy(() => {
    //   const OrganizationResponseZodSchema = require('./organization.interface').OrganizationResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
    //   return OrganizationResponseZodSchema.optional();
    // }),
  });

export const UpdateMealPreferenceRequestZodSchema =
  MealPreferenceRequestZodSchema.partial();

/* ---------- TypeScript Types ---------- */

export type MealPreferenceRequest = z.infer<
  typeof MealPreferenceRequestZodSchema
>;
export type MealPreferenceResponse = z.infer<
  typeof MealPreferenceResponseZodSchema
>;
export type UpdateMealPreferenceRequest = z.infer<
  typeof UpdateMealPreferenceRequestZodSchema
>;
