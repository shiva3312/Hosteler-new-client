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
  action: z.nativeEnum(GeneralAction).nullish(),
  changes: z.array(
    z
      .object({
        field: z.string(),
        oldValue: z.any(),
        newValue: z.any(),
      })
      .nullish(),
  ),
  comment: Primitive.safeString().nullish(),
  timestamp: Primitive.safeDate('Action Date').nullish(),
});

export const UsernameZodSchema = z.union([
  Primitive.safeString('Username', [], 3, 20)
    .transform((val) => val.toLowerCase().trim()) // Convert all characters to lowercase
    .refine((val) => /^[a-z0-9_.]+$/.test(val), {
      message:
        'Username can only contain letters, numbers, dot, and underscores',
    }),
  Primitive.safeEmail().transform((val) => val.toLowerCase().trim()),
]);

export const PasswordZodSchema = Primitive.safeString('Password', [], 8, 20)
  .transform((val) => val.trim())
  .refine(
    (val) =>
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#^()_.])[A-Za-z\d@$!%*?&#^()_.]{8,20}$/.test(
        val,
      ),
    {
      message:
        'Password must be 8-20 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character (including ^, #, (, ), and _).',
    },
  );

export const historyFilterOptionsSchema = z.object({
  fields: z.array(z.string()).optional(),
  user: z.string().optional(),
  action: z.string().optional(),
  startDate: z.coerce.date().optional(), // coercing in case ISO string is passed
  endDate: z.coerce.date().optional(),
});

export const filterLogicSchema = z.enum(['AND', 'OR']);

export const filterHistoryParamsSchema = z.object({
  filters: historyFilterOptionsSchema.optional(),
  limit: z.number().int().positive().max(100).optional(), // max 100 to prevent abuse
  logic: filterLogicSchema.optional().default('AND'),
});

/* ---------- TypeScript Types ---------- */
export type ResponseData<T> = z.infer<ReturnType<typeof ResponseDataSchema<T>>>;
export type Meta = z.infer<typeof MetaZodSchema>;
export type UserAction = z.infer<typeof UserActionZodSchema>;
export type HistoryFilterOptions = z.infer<typeof historyFilterOptionsSchema>;
export type FilterLogic = z.infer<typeof filterLogicSchema>;
export type FilterHistoryParams = z.infer<typeof filterHistoryParamsSchema>;
