//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { z } from 'zod';

import { MetaZodSchema } from '../common.interface';
import { MealType, MenuType } from '../enums';
import { Primitive } from '../primitive.class';

export const MealPreferenceRequestZodSchema = z.object({
  quantity: Primitive.safeNumber('Quantity', 0).nullish(),
  interest: Primitive.safeNumber('Interest', 0).nullish(), // rating given by the user for this meal preference, 0 means not rated
  priority: Primitive.safeNumber('Priority', 0).nullish(), // priority of the meal preference, lower number means higher priority
  rating: Primitive.safeNumber('Rating', 0).nullish(), // rating given by the user for this meal preference, 0 means not rated
  mealType: z.nativeEnum(MealType), // type of the menu, e.g. vegetarian, non-vegetarian, vegan, etc.
  menuType: z.nativeEnum(MenuType), // type of the menu, e.g. breakfast, lunch, dinner, snack, etc.
  // reference fields
  mealItem: Primitive.safeID().nullish(), // id of the meal item
  user: Primitive.safeID().nullish(), // array of user ids
  unit: Primitive.safeID().nullish(), // array of unit ids
  organization: Primitive.safeID().nullish(), // organization id
});

export const MealPreferenceResponseZodSchema = z
  .object({
    _id: Primitive.safeID(),
    createdAt: Primitive.safeDate(),
    updatedAt: Primitive.safeDate(),
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
