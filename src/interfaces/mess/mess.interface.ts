//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { z } from 'zod';

import {
  MetaZodSchema,
  UserActionResponseZodSchema,
} from '../common.interface';
import { MessStatus } from '../enums';
import { Primitive } from '../primitive.class';

export const MessRequestZodSchema = z.object({
  name: Primitive.safeString('Name', [], 2, 20).nullish(),
  status: z.nativeEnum(MessStatus).default(MessStatus.Open), // status of the menu cycle
  description: Primitive.safeString('Description').nullish(),
  image: Primitive.safeString('Image URL').optional(),

  // block user to changes status before some time of chart prepration
  blockUserToChangeMealStatusBefore: Primitive.safeNumber(
    'Block User to Change Status Before in minutes',
  ).default(30), // time in minutes before chart preparation when user cannot change status

  // timings for meals
  breakFastTime: z
    .object({
      startTime: Primitive.safeTime('Breakfast start time'),
      endTime: Primitive.safeTime('Breakfast end time'),
      isActive: z.boolean().default(true), // whether breakfast is active or not
    })
    .default({ startTime: '09:00', endTime: '11:00' }), // time when breakfast is served
  lunchTime: z
    .object({
      startTime: Primitive.safeTime('Lunch start time'),
      endTime: Primitive.safeTime('Lunch end time'),
      isActive: z.boolean().default(true),
    })
    .default({ startTime: '13:00', endTime: '15:00' }),
  dinnerTime: z
    .object({
      startTime: Primitive.safeTime('Dinner start time'),
      endTime: Primitive.safeTime('Dinner end time'),
      isActive: z.boolean().default(true),
    })
    .default({ startTime: '17:00', endTime: '18:00' }),
  snackTime: z
    .object({
      startTime: Primitive.safeTime('Snack start time'),
      endTime: Primitive.safeTime('Snack end time'),
      isActive: z.boolean().default(true),
    })
    .default({ startTime: '20:00', endTime: '22:00' }),

  // chart time when the meal is available
  breakFastChartTime: Primitive.safeTime('Breakfast chart start time').default(
    '08:00',
  ),
  lunchChartTime: Primitive.safeTime('Lunch chart start time').default('12:00'),
  dinnerChartTime: Primitive.safeTime('Dinner chart start time').default(
    '16:00',
  ),
  snackChartTime: Primitive.safeTime('Snack chart start time').default('19:00'),

  // restriction before in minutes
  turnOnDinnerBefore: Primitive.safeNumber('Alert before in minutes').default(
    30,
  ), // alert before in minutes
  turnOnLunchBefore: Primitive.safeNumber('Alert before in minutes').default(
    30,
  ), // alert before in minutes
  turnOnBreakFastBefore: Primitive.safeNumber(
    'Alert before in minutes',
  ).default(30), // alert before in minutes
  turnOnSnackBefore: Primitive.safeNumber('Alert before in minutes').default(
    30,
  ),

  // alert if meal off exceeds this number
  alertIfLunchOffExceeds: Primitive.safeNumber(
    'Alert if Lunch exceeds',
  ).default(10), // alert if meal off exceeds this number
  alertIfDinnerOffExceeds: Primitive.safeNumber(
    'Alert if Dinner exceeds',
  ).default(10), // alert if meal off exceeds this number
  alertIfBreakFastOffExceeds: Primitive.safeNumber(
    'Alert if Breakfast exceeds',
  ).default(10), // alert if meal off exceeds this number
  alertIfSnackOffExceeds: Primitive.safeNumber(
    'Alert if Snack exceeds',
  ).default(10), // alert if meal off exceeds this number

  // alert if meal on exceeds
  alertIfLunchOnExceeds: Primitive.safeNumber('Alert if Lunch exceeds').default(
    10,
  ), // alert if meal on exceeds this number
  alertIfDinnerOnExceeds: Primitive.safeNumber(
    'Alert if Dinner exceeds',
  ).default(10), // alert if meal on exceeds this number
  alertIfBreakFastOnExceeds: Primitive.safeNumber(
    'Alert if Breakfast exceeds',
  ).default(10), // alert if meal on exceeds this number
  alertIfSnackOnExceeds: Primitive.safeNumber('Alert if Snack exceeds').default(
    10,
  ), // alert if meal on exceeds this number

  // extra meal count
  extraMealCount: Primitive.safeNumber('Extra Meal Count', 0).default(0), // number of extra meals requested

  // reference fields
  unit: Primitive.safeID().nullish(),
  organization: Primitive.safeID().nullish(),
});

export const MessResponseZodSchema = z
  .object({
    _id: Primitive.safeID(),
    createdAt: Primitive.safeDate(),
    updatedAt: Primitive.safeDate(),
    history: z.array(UserActionResponseZodSchema).optional(), // array of user actions on this menuCycle
  })
  .merge(MessRequestZodSchema)
  .extend({
    meta: MetaZodSchema.optional(),
    // unit: z.lazy(() => require('../unit.interface').UnitResponseZodSchema.nullish()),
    // organization: z.lazy(() => require('../organization.interface').OrganizationResponseZodSchema.optional()),
  });

export const UpdateMessRequestZodSchema = MessRequestZodSchema.partial();

/* ---------- TypeScript Types ---------- */

export type MessRequest = z.infer<typeof MessRequestZodSchema>;
export type MessResponse = z.infer<typeof MessResponseZodSchema>;
export type UpdateMessRequest = z.infer<typeof UpdateMessRequestZodSchema>;
