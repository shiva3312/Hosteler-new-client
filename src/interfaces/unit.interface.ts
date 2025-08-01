//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { z } from 'zod';

import { MetaZodSchema } from './common.interface';
import { Primitive } from './primitive.class';
import { AddressZodSchema, ContactZodSchema } from './user.interface';

export const UnitRequestZodSchema = z.object({
  name: Primitive.safeString('Unit name', [], 3, 20),
  type: Primitive.safeString('Unit type', [], 2, 20).nullish(),
  description: Primitive.safeString('Unit description').nullish(),
  contacts: ContactZodSchema.nullish(),
  address: AddressZodSchema.nullish(),

  // reference fields
  admin: Primitive.safeID(),
  mess: Primitive.safeID().nullish(),
  users: z.array(Primitive.safeID()).optional().default([]),
  groups: z.array(Primitive.safeID()).nullish().default([]),
  organization: Primitive.safeID(),
});

export const UnitResponseZodSchema = z
  .object({
    _id: Primitive.safeID(),
    createdAt: Primitive.safeDate(),
    updatedAt: Primitive.safeDate(),
  })
  .extend({
    meta: MetaZodSchema.optional(),
    // admin: z.lazy(() => {
    //   const UserResponseZodSchema = require('./user.interface').UserResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
    //   return UserResponseZodSchema.optional();
    // }),
    // users: z.lazy(() => {
    //   const UserResponseZodSchema = require('./user.interface').UserResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
    //   return z.array(UserResponseZodSchema).optional();
    // }),
    // groups: z.lazy(() => {
    //   const GroupResponseZodSchema = require('./group.interface').GroupResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
    //   return GroupResponseZodSchema.optional();
    // }),
    // organization: z.lazy(() => {
    //   const OrganizationResponseZodSchema = require('./organization.interface').OrganizationResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
    //   return z.array(OrganizationResponseZodSchema).optional();
    // }),
  })
  .merge(UnitRequestZodSchema);

export const UpdateUnitRequestZodSchema = UnitRequestZodSchema.partial();

/* ---------- TypeScript Types ---------- */

export type UnitRequest = z.infer<typeof UnitRequestZodSchema>;
export type UnitResponse = z.infer<typeof UnitResponseZodSchema>;
export type UpdateUnitRequest = z.infer<typeof UpdateUnitRequestZodSchema>;
