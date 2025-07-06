//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { z } from 'zod';

import { dataZodSchema, MetaZodSchema } from './common.interface';

export const GroupRequestZodSchema = z.object({
  name: z.string().min(3).max(30),
  description: z.string().min(3).max(100).optional(),
  // canAccess: Primitive.safeString().optional(), // short time permission to access a resource

  // reference fields
  userIds: z.array(z.string()).optional(), // array of user ids
  unitId: z.string(),
  organizationId: z.string(),
});

export const GroupResponseZodSchema = z
  .object({
    _id: z.string(),
    createdAt: dataZodSchema,
    updatedAt: dataZodSchema,
  })
  .extend({
    permission: z.string().optional(),
    users: z.lazy(() => {
      const UserResponseZodSchema =
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('./user.interface').UserResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
      return z.array(UserResponseZodSchema).optional();
    }),
    units: z.lazy(() => {
      const UnitResponseZodSchema =
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('./unit.interface').UnitResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
      return z.array(UnitResponseZodSchema).optional();
    }),
    organization: z.lazy(() => {
      const OrganizationsResponseZodSchema =
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('./organization.interface').OrganizationsResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
      return z.array(OrganizationsResponseZodSchema).optional();
    }),
    meta: MetaZodSchema.optional(),
  })
  .merge(GroupRequestZodSchema)
  .omit({ userIds: true, unitId: true, organizationId: true });

/* ---------- TypeScript Types ---------- */

export type GroupRequest = z.infer<typeof GroupRequestZodSchema>;
export type GroupResponse = z.infer<typeof GroupResponseZodSchema>;
