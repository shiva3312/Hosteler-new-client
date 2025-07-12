//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { z } from 'zod';

import { Primitive } from './primitive.class';
import { UserRequestZodSchema, UserResponse } from './user.interface';

export const DataStoredInTokenZodSchema = z.object({
  _id: z.string(),
});

export const TokenDataZodSchema = z.object({
  token: z.string(),
  expiresIn: z.number(),
});

export const UserLoginRequestZodSchema = z.object({
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters long')
    .max(20, 'Username must be at most 20 characters long'),
  password: z
    .string()
    .min(2, 'Password must be at least 2 characters long')
    .max(20, 'Password must be at most 20 characters long'),
  rememberMe: z.boolean().optional(),
});

export const ChangePasswordRequestZodSchema = z
  .object({
    oldPassword: Primitive.safeString('Old Password', [], 2, 20),
    newPassword: Primitive.safeString('New Password', [], 2, 20),
    confirmNewPassword: Primitive.safeString('Confirm New Password', [], 2, 20),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New password and confirm password must match',
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: 'New password must be different from old password',
  });

export const UserRegisterRequestZodSchema = UserRequestZodSchema.extend({
  confirmPassword: z.string().nullish(),
  username: z.string().min(2, 'Username must be at least 2 characters long'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'], // This will associate the error with confirmPassword field
});

export type DataStoredInToken = z.infer<typeof DataStoredInTokenZodSchema>;
export type TokenData = z.infer<typeof TokenDataZodSchema>;
export type UserLoginRequest = z.infer<typeof UserLoginRequestZodSchema>;
export type ChangePasswordRequest = z.infer<
  typeof ChangePasswordRequestZodSchema
>;

export interface RequestWithUser extends Request {
  user: UserResponse;
}
