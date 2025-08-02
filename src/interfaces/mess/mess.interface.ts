//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { z } from 'zod';

import { MetaZodSchema } from '../common.interface';
import { MessStatus } from '../enums';
import { Primitive } from '../primitive.class';

export const MessRequestZodSchema = z.object({
  name: Primitive.safeString('Name', [], 2, 20).nullish(),
  status: z.nativeEnum(MessStatus).default(MessStatus.Open), // status of the menu cycle
  description: Primitive.safeString('Description').nullish(),
  image: Primitive.safeString('Image URL').optional(),

  /**
   * Whether to select item preference for the user or not if menu cycle & menu are found
   * If true, it will select the item preference for the user based on their preferences.
   * If false, it will not select any item preference and return an error if the requested meal is not found.
   * Default is true, meaning it will select the item preference for the user.
   */

  selectItemPreference: z.boolean().default(true), // whether to select item preference for the user or not

  /**
   * Whether to select default meal if not found in menu
   * If true, it will select the default meal if the requested meal is not found in the menu.
   * If false, it will not select any meal and return an error if the requested meal is not found.
   * This is useful for cases where the menu may not have all the meals available,
   * and you want to ensure that a meal is always selected for the user
   * Default is true, meaning it will select the default meal if not found in the menu
   *
   * @example
   * selectDefaultMealIfNotFoundInMenu: true // will select default meal item if not found in menu
   * selectDefaultMealIfNotFoundInMenu: false // will not select any meal item if not found in menu
   */
  selectDefaultMealIfNotFoundInMenu: z.boolean().default(true),

  /**
   * Block User to Change Meal Status Before
   * This is the time in minutes before the chart preparation when the user cannot change their meal
   * status. This is useful to prevent users from changing their meal status too close to the
   * chart preparation time, which can cause issues in meal planning and preparation.
   * Default is 30 minutes, meaning the user cannot change their meal status 30 minutes
   * before the chart preparation time.
   */
  blockUserToChangeMealStatusBefore: Primitive.safeNumber(
    'Block User to Change Status Before in minutes',
  ).default(30), // time in minutes before chart preparation when user cannot change status

  /**
   * Meal Time Configuration
   * These fields define the time when each meal is served and whether it is active or not
   * Each meal has a start time, end time, and an isActive flag to indicate
   * whether the meal is currently being served or not.
   * The start and end times are in HH:mm format, and the isActive flag is a boolean
   * indicating whether the meal is currently active.
   * Default times are set for each meal, but they can be overridden by the user.
   * The default times are:
   * - Breakfast: 09:00 to 11:00
   * - Lunch: 13:00 to 15:00
   * - Dinner: 17:00 to 18:00
   * - Snack: 20:00 to 22:00
   * The isActive flag is set to true by default, meaning the meal is currently being served.
   * This allows for flexibility in meal planning and preparation, as the times can be adjusted
   * based on the needs of the users and the availability of resources.
   */
  breakFastTime: z
    .object({
      startTime: Primitive.safeTime('Breakfast start time'),
      endTime: Primitive.safeTime('Breakfast end time'),
      // isActive: z.boolean().default(true), // whether breakfast is active or not
    })
    .default({ startTime: '09:00', endTime: '11:00' }), // time when breakfast is served
  lunchTime: z
    .object({
      startTime: Primitive.safeTime('Lunch start time'),
      endTime: Primitive.safeTime('Lunch end time'),
      // isActive: z.boolean().default(true),
    })
    .default({ startTime: '13:00', endTime: '15:00' }),
  dinnerTime: z
    .object({
      startTime: Primitive.safeTime('Dinner start time'),
      endTime: Primitive.safeTime('Dinner end time'),
      // isActive: z.boolean().default(true),
    })
    .default({ startTime: '17:00', endTime: '18:00' }),
  snackTime: z
    .object({
      startTime: Primitive.safeTime('Snack start time'),
      endTime: Primitive.safeTime('Snack end time'),
      // isActive: z.boolean().default(true),
    })
    .default({ startTime: '20:00', endTime: '22:00' }),

  /**
   * Meal Chart Configuration
   * These fields define the time when each meal chart is prepared
   * for meal preparation. The chart is prepared before the meal time,
   * The chart preparation times are set to default values, but they can be overridden by the
   * The alert settings are also set to default values, which can be adjusted by the user.
   * The default alert times are:
   * - Alert before breakfast: 30 minutes
   * - Alert before lunch: 30 minutes
   * - Alert before dinner: 30 minutes
   * - Alert before snack: 30 minutes
   */
  // breakFastChartTime: Primitive.safeTime('Breakfast chart start time').default(
  //   '08:00',
  // ),
  // lunchChartTime: Primitive.safeTime('Lunch chart start time').default('12:00'),
  // dinnerChartTime: Primitive.safeTime('Dinner chart start time').default(
  //   '16:00',
  // ),
  // snackChartTime: Primitive.safeTime('Snack chart start time').default('19:00'),

  /**
   * Meal Alert Configuration
   * These fields define the alert settings for each meal.
   * The alert settings include the time before the meal when the user will be alerted,
   * and the alert thresholds for meal off and meal on.
   * The alert times are set to default values, which can be adjusted by the user.
   * The default alert times are:
   * - Alert before breakfast: 30 minutes
   * - Alert before lunch: 30 minutes
   * - Alert before dinner: 30 minutes
   * - Alert before snack: 30 minutes
   * The alert thresholds are also set to default values, which can be adjusted by the user
   */
  // turnOnDinnerBefore: Primitive.safeNumber('Alert before in minutes').default(
  //   30,
  // ), // alert before in minutes
  // turnOnLunchBefore: Primitive.safeNumber('Alert before in minutes').default(
  //   30,
  // ), // alert before in minutes
  // turnOnBreakFastBefore: Primitive.safeNumber(
  //   'Alert before in minutes',
  // ).default(30), // alert before in minutes
  // turnOnSnackBefore: Primitive.safeNumber('Alert before in minutes').default(
  //   30,
  // ),

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

  /**
   * Extra Meal Count
   * This field defines the number of extra meals requested for mess.
   * It is useful for cases where the mess may need additional meals beyond the standard meal plan
   * The extra meal count is set to 0 by default, meaning no extra meals are requested.
   */
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
    // array of user actions on this menuCycle
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
