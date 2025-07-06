//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { z } from 'zod';

import { dataZodSchema } from './common.interface';
import { AddressZodSchema, ContactZodSchema } from './user.interface';

export const UnitRequestZodSchema = z.object({
  name: z
    .string()
    .min(2, 'Unit name must be at least 2 characters long')
    .max(20, 'Unit name must be at most 20 characters long'),
  type: z.string().nullish(), // unit type
  description: z.string().min(3).max(100).optional(),
  contacts: ContactZodSchema.nullish(),
  address: AddressZodSchema.nullish(),

  // reference fields
  adminId: z.string().nullish(),
  userIds: z.array(z.string()).nullish(), // array of user ids
  groupIds: z.string().nullish(), // array of group ids
  organizationId: z.string().nullish(),
});

export const UnitResponseZodSchema = z
  .object({
    id: z.string(),
    createdAt: dataZodSchema,
    updatedAt: dataZodSchema,
  })
  .extend({
    admin: z.lazy(() => {
      const UserResponseZodSchema =
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('./user.interface').UserResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
      return UserResponseZodSchema.optional();
    }),
    users: z.lazy(() => {
      const UserResponseZodSchema =
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('./user.interface').UserResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
      return z.array(UserResponseZodSchema).optional();
    }),
    groups: z.lazy(() => {
      const GroupResponseZodSchema =
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('./group.interface').GroupResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
      return GroupResponseZodSchema.optional();
    }),
    organization: z.lazy(() => {
      const OrganizationsResponseZodSchema =
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('./organization.interface').OrganizationsResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
      return z.array(OrganizationsResponseZodSchema).optional();
    }),
  })
  .merge(UnitRequestZodSchema)
  .omit({ userIds: true, organizationId: true, groupIds: true, adminId: true });

/* ---------- TypeScript Types ---------- */

export type UnitRequest = z.infer<typeof UnitRequestZodSchema>;
export type UnitResponse = z.infer<typeof UnitResponseZodSchema>;
