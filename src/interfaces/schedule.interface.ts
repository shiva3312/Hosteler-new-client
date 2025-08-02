//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import moment from 'moment-timezone';
import { z } from 'zod';

import { MetaZodSchema } from './common.interface';
import { ScheduleFor, ScheduleStatus, ScheduleType } from './enums';
import { Primitive } from './primitive.class';

export const ScheduleRequestZodSchema = z.object({
  name: Primitive.safeString().optional(),
  description: Primitive.safeString().optional(),

  // startTime: Primitive.safeDate('Start Time'), // Start time of the schedule
  // endTime: Primitive.safeDate('End Time').nullish(), // End time of the schedule
  time: Primitive.safeTime('Time').optional(), // Time of day for the schedule
  daysOfMonth: z.array(Primitive.safeNumber()).optional(), // Days of the month for monthly schedules
  dayOfWeeks: z.array(Primitive.safeNumber()).optional(), // Days of the week for weekly schedules
  monthsOfYear: z.array(Primitive.safeNumber()).optional(), // Months of the year for
  cronTime: Primitive.safeString().optional(), // Cron expression for scheduling
  isActive: z.boolean().default(true), // Indicates if the schedule is active
  status: z.nativeEnum(ScheduleStatus).default(ScheduleStatus.Pending), // Status of the schedule
  type: z.nativeEnum(ScheduleType), // Type of the schedule, e.g., 'daily', 'weekly', etc.
  scheduleFor: z.nativeEnum(ScheduleFor), // Specific schedule for meals or other purposes
  data: z.any().optional(), // Additional data related to the schedule
  timezone: Primitive.safeString().refine(
    (val) => moment.tz.names().includes(val),
    { message: 'Invalid timezone' },
  ),

  // reference fields
  unit: Primitive.safeID().optional(),
  organization: Primitive.safeID().optional(),
});

export const ScheduleResponseZodSchema = z
  .object({
    _id: Primitive.safeID(),
    createdAt: Primitive.safeDate(),
    updatedAt: Primitive.safeDate(),
  })
  .extend({
    meta: MetaZodSchema.optional(),
  })
  .merge(ScheduleRequestZodSchema);
export const UpdateScheduleRequestZodSchema =
  ScheduleRequestZodSchema.partial();

/* ---------- TypeScript Types ---------- */

export type ScheduleRequest = z.infer<typeof ScheduleRequestZodSchema>;
export type ScheduleResponse = z.infer<typeof ScheduleResponseZodSchema>;
export type UpdateScheduleRequest = z.infer<
  typeof UpdateScheduleRequestZodSchema
>;
