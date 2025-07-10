//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { z } from 'zod';

import {
  MetaZodSchema,
  UserActionResponseZodSchema,
} from '../common.interface';
import { MenuCategory } from '../enums';
import { Primitive } from '../primitive.class';

const MealItemResponseZodSchema = z.lazy(() =>
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('./meal-item.interface').MealItemResponseZodSchema.optional(),
); // Defers module resolution until runtime - to avoid circular dependency);

export const MenuRequestZodSchema = z.object({
  name: Primitive.safeString('Name', [], 2, 20).nullish(),
  price: Primitive.safeNumber('Price', 0).optional(),
  image: Primitive.safeString('Image URL').optional(),
  description: Primitive.safeString(),
  items: z
    .array(
      z.object({
        item: Primitive.safeID(), // id of the meal item
        options: z.array(Primitive.safeID()).default([]),
      }),
    )
    .default([]), // array of meal items with options
  MenuCategory: z.nativeEnum(MenuCategory).default(MenuCategory.Regular), // category of the menu, e.g., Regular, Special, Seasonal, Festive, Customs
  isActive: z.boolean().default(true), // whether this menu is active or not
  tags: z.array(Primitive.safeString('Tag')).default([]), // array of tags for this menu eg : ['vegan', 'gluten-free', 'spicy']
  likedByUserIds: z.array(Primitive.safeID()).default([]), // array of user ids who liked this menu
  // reference fields
  unit: Primitive.safeID().nullish().default(null),
  organization: Primitive.safeID().nullish().default(null), // organization id this menu belongs to
});

export const MenuResponseZodSchema = z
  .object({
    _id: Primitive.safeID(),
    createdAt: Primitive.safeDate(),
    updatedAt: Primitive.safeDate(),
    history: z.array(UserActionResponseZodSchema).optional(), // array of user actions on this menu
  })
  .merge(MenuRequestZodSchema)
  .extend({
    meta: MetaZodSchema.optional(),
    // likedByUsers: z.array(z.lazy(() => require('./user.interface').UserResponseZodSchema)).nullish(), // array of user objects who liked this menu
    items: z.array(
      z.object({
        item: MealItemResponseZodSchema,
        options: z.array(MealItemResponseZodSchema).default([]),
      }),
    ),
    // unit: z.lazy(() => {
    //   const UnitResponseZodSchema = require('./unit.interface').UnitResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
    //   return UnitResponseZodSchema.nullish();
    // }),
    // organization: z.lazy(() => {
    //   const OrganizationResponseZodSchema = require('./organization.interface').OrganizationResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
    //   return OrganizationResponseZodSchema.optional();
    // }),
  });

export const UpdateMenuRequestZodSchema = MenuRequestZodSchema.partial();

/* ---------- TypeScript Types ---------- */

export type MenuRequest = z.infer<typeof MenuRequestZodSchema>;
export type MenuResponse = z.infer<typeof MenuResponseZodSchema>;
export type UpdateMenuRequest = z.infer<typeof UpdateMenuRequestZodSchema>;
