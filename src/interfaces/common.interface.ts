//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { z } from 'zod';

export const ResponseDataSchema = <T>(schema: z.ZodType<T, any, any>) =>
  z.object({
    data: schema.optional(), // Expect a specific type `T` for the `data` field
    status: z.enum(['error', 'success']).optional(), // Status can either be 'error' or 'success'
    message: z.string().optional(),
    error: z.string().optional(), // `message` is a required string
    meta: MetaZodSchema.optional(),
  });

export const MetaZodSchema = z.object({
  totalGroups: z.string().optional(),
  totalUnits: z.string().optional(),
  totalOrganizations: z.string().optional(),
  totalUsers: z.string().optional(),
  time: z.string().optional(),
});

export const dataZodSchema = z.union([z.date(), z.string(), z.number()]);

/* ---------- TypeScript Types ---------- */
export type ResponseData<T> = z.infer<ReturnType<typeof ResponseDataSchema<T>>>;
export type Meta = z.infer<typeof MetaZodSchema>;
