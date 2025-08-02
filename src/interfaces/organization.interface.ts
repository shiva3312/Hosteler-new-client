//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { z } from 'zod';

import { MetaZodSchema } from './common.interface';
import { Primitive } from './primitive.class';
import { AddressZodSchema, ContactZodSchema } from './user.interface';

export const OrganizationRequestZodSchema = z.object({
  name: Primitive.safeString('Organization name', [], 3, 20),
  description: Primitive.safeString().nullish(),
  contacts: ContactZodSchema.nullish(),
  address: AddressZodSchema.nullish(),

  // reference fields
  superAdmin: Primitive.safeID(),
  units: z.array(Primitive.safeID()).optional(), // array of unit ids
  users: z.array(Primitive.safeID()).optional(),
});

export const OrganizationResponseZodSchema = z
  .object({
    _id: Primitive.safeID(),
    createdAt: Primitive.safeDate(),
    updatedAt: Primitive.safeDate(),
  })
  .extend({
    meta: MetaZodSchema.optional(),
    // permission: Primitive.safeString().optional(),
    // superAdmin: z.lazy(() => {
    //   const UserResponseZodSchema = require('./user.interface').UserResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
    //   return UserResponseZodSchema.optional();
    // }),
    // units: z.lazy(() => {
    //   const UnitResponseZodSchema = require('./unit.interface').UnitResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
    //   return z.array(UnitResponseZodSchema).optional();
    // }),
    // users: z.lazy(() => {
    //   const UserResponseZodSchema = require('./user.interface').UserResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
    //   return z.array(UserResponseZodSchema).optional();
    // }),
  })
  .merge(OrganizationRequestZodSchema);

export const UpdateOrganizationRequestZodSchema =
  OrganizationRequestZodSchema.partial();

// const OrganizationResponseZodSchema = OrganizationResponseZodSchemaFn();

/* ---------- TypeScript Types ---------- */

export type OrganizationRequest = z.infer<typeof OrganizationRequestZodSchema>;
export type OrganizationResponse = z.infer<
  typeof OrganizationResponseZodSchema
>;
export type UpdateOrganizationRequest = z.infer<
  typeof UpdateOrganizationRequestZodSchema
>;
