//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { z } from 'zod';

import { MenuResponseZodSchema } from './menu.interface';
import {
  MetaZodSchema,
  UserActionResponseZodSchema,
} from '../common.interface';
import { MenuType } from '../enums';
import { Primitive } from '../primitive.class';

export const MenuCycleRequestZodSchema = z.object({
  name: Primitive.safeString('Name', [], 2, 20).nullish(),
  description: Primitive.safeString().optional(),
  startDay: Primitive.safeNumber('Start Day', 1, 31).optional().default(1), // 1 for Monday, 7 for Sunday
  menusInCycle: z
    .array(
      z.object({ order: Primitive.safeNumber(), menu: Primitive.safeID() }),
    )
    .optional(),
  tags: z.array(Primitive.safeString('Tag')).optional().default([]), // array of tags for this menuCycle
  likedByUserIds: z.array(Primitive.safeID()).optional().default([]), // array of user ids who liked this menuCycle
  isActive: z.boolean().default(true), // whether this menuCycle is active or not
  cycleFor: z.nativeEnum(MenuType), // type of the menu, e.g. breakfast, lunch, dinner, snack, etc.
  // reference fields
  unit: Primitive.safeID().nullish(),
  organization: Primitive.safeID().nullish(),
});

export const MenuCycleResponseZodSchema = z
  .object({
    _id: Primitive.safeID(),
    createdAt: Primitive.safeDate(),
    updatedAt: Primitive.safeDate(),
    history: z.array(UserActionResponseZodSchema).optional(), // array of user actions on this menuCycle
  })
  .merge(MenuCycleRequestZodSchema)
  .extend({
    meta: MetaZodSchema.optional(),
    // likedByUsers: z.array(z.lazy(() => require('./user.interface').UserResponseZodSchema)).nullish(), // array of user objects who liked this menuCycle
    menusInCycle: z.array(
      z.object({
        menu: MenuResponseZodSchema,
        order: Primitive.safeNumber('Order', 1, 100),
      }),
    ), // array of menus in this cycle
    // unit: z.lazy(() => require('./unit.interface').UnitResponseZodSchema.nullish()),
    // organization: z.lazy(() => require('./organization.interface').OrganizationResponseZodSchema.optional()),
  });

export const UpdateMenuCycleRequestZodSchema =
  MenuCycleRequestZodSchema.partial();

/* ---------- TypeScript Types ---------- */

export type MenuCycleRequest = z.infer<typeof MenuCycleRequestZodSchema>;
export type MenuCycleResponse = z.infer<typeof MenuCycleResponseZodSchema>;
export type UpdateMenuCycleRequest = z.infer<
  typeof UpdateMenuCycleRequestZodSchema
>;
