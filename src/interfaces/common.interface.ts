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
  user: Primitive.safeID().nullish(),
  success: z.boolean().nullish(),
  action: z.nativeEnum(GeneralAction).nullish(),
  oldValue: z.any().nullish(),
  newValue: z.any().nullish(),
  comment: Primitive.safeString().nullish(),
  timestamp: Primitive.safeDate('Action Date').nullish(),
});

export const UserActionResponseZodSchema = UserActionZodSchema.extend({
  user: z.lazy(() => {
    const UserResponseZodSchema =
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('./user.interface').UserResponseZodSchema;
    return UserResponseZodSchema.optional();
  }),
});

export const UsernameZodSchema = Primitive.safeString('Username', [], 2, 20);
// FIXME: User Following regex for username validation
// z.union([
//   Primitive.safeString('Username', [], 3, 20)
//     .transform(val => val.toLowerCase()) // Convert all characters to lowercase
//     .refine(val => /^[a-z0-9_.]+$/.test(val), {
//       message: 'Username can only contain letters, numbers, dot, and underscores',
//     }),
//   Primitive.safeEmail().transform(val => val.toLowerCase()),
// ]);

export const PasswordZodSchema = Primitive.safeString('Username', [], 2, 20);
// FIXME: User following regex for password validation
// Primitive.safeString('Password', [], 8, 20).refine(
//   val => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(val),
//   {
//     message:
//       'Password must be 8-20 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character',
//   },
// );

/* ---------- TypeScript Types ---------- */
export type ResponseData<T> = z.infer<ReturnType<typeof ResponseDataSchema<T>>>;
export type Meta = z.infer<typeof MetaZodSchema>;
export type UserAction = z.infer<typeof UserActionZodSchema>;
export type UserActionResponse = z.infer<typeof UserActionResponseZodSchema>;
