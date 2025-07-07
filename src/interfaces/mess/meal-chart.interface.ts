//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { z } from 'zod';

import {
  MetaZodSchema,
  UserActionResponseZodSchema,
} from '../common.interface';
import { MenuType } from '../enums';
import { Primitive } from '../primitive.class';

export const MealChartRequestZodSchema = z.object({
  name: Primitive.safeString('Meal Chart Name'), // name of the meal chart
  description: Primitive.safeString('Description').nullish(), // description of the meal chart
  menuType: z.nativeEnum(MenuType),
  chartPrepareTime: Primitive.safeDate('Chart Prepared Time'),
  userWithMealPreference: z
    .array(
      z.object({
        user: Primitive.safeID(),
        items: z.array(Primitive.safeID()).default([]), // array of meal item ids preferred by the user
      }),
    )
    .default([]),
  serveTime: Primitive.safeDate('Serve Time').nullish(), // time when the meal is served
  notes: Primitive.safeString('Notes').nullish(), // additional notes for the meal chart
  alert: Primitive.safeString('Alert').nullish(), // alert message for the meal chart
  extraMealCount: Primitive.safeNumber('Extra Meal Count', 0).default(0), // number of extra meals requested

  maintainerId: Primitive.safeID().nullish(), // id of the user who maintains this meal chart eg: admin in unit or any specific role in unit /org
  menu: Primitive.safeID().nullish(), // array of menu ids
  menuCycle: Primitive.safeID().nullish(),

  // reference fields
  // id of the menu cycle this meal chart belongs to
  mess: Primitive.safeID().nullish(), // id of the mess this meal chart belongs to
  unit: Primitive.safeID().nullish(), // id of the unit this meal chart belongs to
  organization: Primitive.safeID().nullish(), // id of the organization this meal chart
});

export const MealChartResponseZodSchema = z
  .object({
    _id: Primitive.safeID(),
    createdAt: Primitive.safeDate(),
    updatedAt: Primitive.safeDate(),
    history: z.array(UserActionResponseZodSchema).optional(), // array of user actions on this mealChart
  })
  .merge(MealChartRequestZodSchema)
  .extend({
    meta: MetaZodSchema.optional(),
    // menu: MenuRequestZodSchema.nullish(), // menu associated with this meal chart
    // userWithMealPreference: z
    //   .array(
    //     z.object({
    //       user: UserResponseZodSchema,
    //       items: z.array(MealItemResponseZodSchema).default([]), // array of meal item ids preferred by the user
    //     }),
    //   )
    //   .default([]),
    // maintainer: UserResponseZodSchema.nullish(), // user who maintains this meal chart
    // unit: z.lazy(() => {
    //   const UnitResponseZodSchema = require('./unit.interface').UnitResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
    //   return UnitResponseZodSchema.nullish();
    // }),
    // organization: z.lazy(() => {
    //   const OrganizationResponseZodSchema = require('./organization.interface').OrganizationResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
    //   return OrganizationResponseZodSchema.optional();
    // }),
  });

export const UpdateMealChartRequestZodSchema =
  MealChartRequestZodSchema.partial();

/* ---------- TypeScript Types ---------- */

export type MealChartRequest = z.infer<typeof MealChartRequestZodSchema>;
export type MealChartResponse = z.infer<typeof MealChartResponseZodSchema>;
export type UpdateMealChartRequest = z.infer<
  typeof UpdateMealChartRequestZodSchema
>;
