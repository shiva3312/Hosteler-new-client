//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { z } from 'zod';

import { GeneralAction } from '@/data/feature';

import { Primitive } from './primitive.class';

export const ResponseDataSchema = <T>(schema: z.ZodType<T, any, any>) =>
  z.object({
    data: schema.optional(), // Expect a specific type `T` for the `data` field
    status: z.enum(['error', 'success']).optional(), // Status can either be 'error' or 'success'
    message: z.string().optional(),
    error: z.string().optional(), // `message` is a required string
    meta: MetaZodSchema.optional(),
    token: z.lazy(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const TokenDataZodSchema = require('./auth.interface').TokenDataZodSchema; // Defers module resolution until runtime - to avoid circular dependency
      return TokenDataZodSchema.optional();
    }),
  });

export const MetaZodSchema = z.object({
  totalGroups: Primitive.safeNumber().optional(),
  totalUnits: Primitive.safeNumber().optional(),
  totalOrganizations: Primitive.safeNumber().optional(),
  totalUsers: Primitive.safeNumber().optional(),
  time: Primitive.safeString().optional(),
});

export const UserActionZodSchema = z.object({
  user: Primitive.safeID(),
  action: z.nativeEnum(GeneralAction),
  oldValue: Primitive.safeString(),
  newValue: Primitive.safeString(),
  comment: Primitive.safeString().optional(),
  timestamp: Primitive.safeDate('Action Date').default(() => new Date()),
});

export const UserActionResponseZodSchema = UserActionZodSchema.extend({
  user: z.lazy(() => {
    const UserResponseZodSchema =
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('./user.interface').UserResponseZodSchema;
    return UserResponseZodSchema.optional();
  }),
});
/* ---------- TypeScript Types ---------- */
export type ResponseData<T> = z.infer<ReturnType<typeof ResponseDataSchema<T>>>;
export type Meta = z.infer<typeof MetaZodSchema>;
export type UserAction = z.infer<typeof UserActionZodSchema>;
export type UserActionResponse = z.infer<typeof UserActionResponseZodSchema>;
