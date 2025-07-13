//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.

import { z } from 'zod';

import { MetaZodSchema, UserActionResponseZodSchema } from './common.interface';
import { TempRequestType } from './enums';
import { Primitive } from './primitive.class';

export const TempRequestRequestZodSchema = z.object({
  name: Primitive.safeString('TempRequest name', [], 3, 20),
  type: z.nativeEnum(TempRequestType).nullish(),
  description: Primitive.safeString('TempRequest description').nullish(),
  data: z.any().nullish(), // additional data for the request, can be anything
  expiresAt: Primitive.safeDate('TempRequest expiry date').nullish(), // when the temp request expires
});

export const TempRequestResponseZodSchema = z
  .object({
    _id: Primitive.safeID(),
    createdAt: Primitive.safeDate(),
    updatedAt: Primitive.safeDate(),
    history: z.array(UserActionResponseZodSchema).optional(), // array of user actions on this menu
  })
  .extend({
    used: z.boolean().default(false), // whether the temp request has been used
    accessedBy: z.array(Primitive.safeID()).optional().default([]), // users who accessed this
    token: Primitive.safeString('TempRequest token', [], 10, 50).nullish(), // public token for the request
    meta: MetaZodSchema.optional(),
  })
  .merge(TempRequestRequestZodSchema);

export const UpdateTempRequestRequestZodSchema =
  TempRequestRequestZodSchema.partial();

/* ---------- TypeScript Types ---------- */

export type TempRequestRequest = z.infer<typeof TempRequestRequestZodSchema>;
export type TempRequestResponse = z.infer<typeof TempRequestResponseZodSchema>;
export type UpdateTempRequestRequest = z.infer<
  typeof UpdateTempRequestRequestZodSchema
>;
