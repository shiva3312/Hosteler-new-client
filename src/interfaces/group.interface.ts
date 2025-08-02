//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { z } from 'zod';

import { MetaZodSchema } from './common.interface';
import { Primitive } from './primitive.class';

export const GroupRequestZodSchema = z.object({
  name: z.string().min(3).max(30),
  description: z.string().min(3).max(100).optional(),
  // canAccess: Primitive.safeString().optional(), // short time permission to access a resource

  // reference fields
  users: z.array(Primitive.safeID()).optional(), // array of user ids
  unit: Primitive.safeID(),
  organization: Primitive.safeID(),
});

export const GroupResponseZodSchema = z
  .object({
    _id: Primitive.safeID(),
    createdAt: Primitive.safeDate(),
    updatedAt: Primitive.safeDate(),
  })
  .extend({
    // permission: Primitive.safeString().optional(),
    // users: z.lazy(() => {
    //   const UserResponseZodSchema = require('./user.interface').UserResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
    //   return z.array(UserResponseZodSchema).optional();
    // }),
    // units: z.lazy(() => {
    //   const UnitResponseZodSchema = require('./unit.interface').UnitResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
    //   return z.array(UnitResponseZodSchema).optional();
    // }),
    // organization: z.lazy(() => {
    //   const OrganizationResponseZodSchema = require('./organization.interface').OrganizationResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
    //   return z.array(OrganizationResponseZodSchema).optional();
    // }),
    meta: MetaZodSchema.optional(),
  })
  .merge(GroupRequestZodSchema);
export const UpdateGroupRequestZodSchema = GroupRequestZodSchema.partial();

/* ---------- TypeScript Types ---------- */

export type GroupRequest = z.infer<typeof GroupRequestZodSchema>;
export type GroupResponse = z.infer<typeof GroupResponseZodSchema>;
export type UpdateGroupRequest = z.infer<typeof UpdateGroupRequestZodSchema>;
