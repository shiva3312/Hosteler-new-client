//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { z } from 'zod';

import {
  MetaZodSchema,
  UserActionResponseZodSchema,
} from '../common.interface';
import { MealCategory, MealType, Unit } from '../enums';
import { Primitive } from '../primitive.class';

export const MealItemRequestZodSchema = z.object({
  name: Primitive.safeString('Name', [], 2, 20).nullish(),
  quantity: Primitive.safeNumber('Quantity', 0).optional(),
  unitType: z.nativeEnum(Unit),
  price: Primitive.safeNumber('Price', 0).nullish().default(null),
  image: Primitive.safeString('Image URL').optional(),
  description: Primitive.safeString(),

  ingredients: z
    .array(
      z.object({
        ingredientId: Primitive.safeID(), // id of the ingredient
        quantity: Primitive.safeNumber('Quantity', 0), // quantity of the ingredient
      }),
    )
    .nullish()
    .default([]), // array of ingredients in this meal item

  mealType: z.nativeEnum(MealType), // type of meal (e.g., Vegetarian, Non-Vegetarian, Vegan, etc.)
  mealCategory: z.nativeEnum(MealCategory), // category of the meal (e.g., Dal, Veg, Dry Veg, Roti, Rice, Salad, Dessert, Beverage, Snack, Soup, Appetizer, Other)
  tags: z.array(Primitive.safeString('Tag')).default([]), // array of tags for this menu
  likedByUserIds: z.array(Primitive.safeID()).default([]), // array of user ids who liked this menu

  // reference fields
  unit: Primitive.safeID().nullish(),
  organization: Primitive.safeID().nullish(),
});

export const MealItemResponseZodSchema = z
  .object({
    _id: Primitive.safeID(),
    createdAt: Primitive.safeDate(),
    updatedAt: Primitive.safeDate(),
    history: z.array(UserActionResponseZodSchema).optional(), // array of user actions on this menu
  })
  .merge(MealItemRequestZodSchema)
  .extend({
    meta: MetaZodSchema.optional(),
    // ingredients: z.array(
    //   z.object({
    //     ingredient: z.lazy(() => require('./ingredient.interface').IngredientResponseZodSchema), // ingredient object
    //     quantity: Primitive.safeNumber('Quantity', 0), // quantity of the ingredient
    //   }),
    // ),
    // likedByUsers: z.array(z.lazy(() => require('./user.interface').UserResponseZodSchema)).nullish(), // array of user objects who liked this menu
    // unit: z.lazy(() => {
    //   const UnitResponseZodSchema = require('./unit.interface').UnitResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
    //   return UnitResponseZodSchema.nullish();
    // }),
    // organization: z.lazy(() => {
    //   const OrganizationResponseZodSchema = require('./organization.interface').OrganizationResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
    //   return OrganizationResponseZodSchema.optional();
    // }),
  });

export const UpdateMealItemRequestZodSchema =
  MealItemRequestZodSchema.partial();

/* ---------- TypeScript Types ---------- */

export type MealItemRequest = z.infer<typeof MealItemRequestZodSchema>;
export type MealItemResponse = z.infer<typeof MealItemResponseZodSchema>;
export type UpdateMealItemRequest = z.infer<
  typeof UpdateMealItemRequestZodSchema
>;
