//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { z } from 'zod';

import { dataZodSchema } from './common.interface';
import { AddressZodSchema, ContactZodSchema } from './user.interface';

export const OrganizationsRequestZodSchema = z.object({
  name: z.string().min(3).max(30),
  description: z.string().min(3).max(100).optional(),
  contacts: ContactZodSchema.nullish(),
  address: AddressZodSchema.nullish(),

  // reference fields
  superAdminId: z.string().optional(), // super admin id
  unitIds: z.array(z.string()).optional(), // array of unit ids
  userIds: z.array(z.string()).optional(), // array of user ids
});

export const OrganizationsResponseZodSchema = z
  .object({
    _id: z.string(),
    createdAt: dataZodSchema,
    updatedAt: dataZodSchema,
  })
  .extend({
    permission: z.string().optional(),
    superAdmin: z.lazy(() => {
      const UserResponseZodSchema =
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('./user.interface').UserResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
      return UserResponseZodSchema.optional();
    }),
    units: z.lazy(() => {
      const UnitResponseZodSchema =
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('./unit.interface').UnitResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
      return z.array(UnitResponseZodSchema).optional();
    }),
    users: z.lazy(() => {
      const UserResponseZodSchema =
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('./user.interface').UserResponseZodSchema; // Defers module resolution until runtime - to avoid circular dependency
      return z.array(UserResponseZodSchema).optional();
    }),
  })
  .merge(OrganizationsRequestZodSchema)
  .omit({ unitIds: true });

// const OrganizationsResponseZodSchema = OrganizationsResponseZodSchemaFn();

/* ---------- TypeScript Types ---------- */

export type OrganizationsRequest = z.infer<
  typeof OrganizationsRequestZodSchema
>;
export type OrganizationsResponse = z.infer<
  typeof OrganizationsResponseZodSchema
>;
