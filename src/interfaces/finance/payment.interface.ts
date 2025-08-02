//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { z } from 'zod';

import { UserActionZodSchema } from '../common.interface';
import { Primitive } from '../primitive.class';

export const PaymentRequestZodSchema = z.object({
  // reference fields
  unit: Primitive.safeID().nullish(),
  organization: Primitive.safeID().nullish(),
});

export const PaymentResponseZodSchema = z.object({
  _id: Primitive.safeID(),
  createdAt: Primitive.safeDate(),
  updatedAt: Primitive.safeDate(),
  // array of user actions on this menu
});

export const UpdatePaymentRequestZodSchema = PaymentRequestZodSchema.partial();

/* ---------- TypeScript Types ---------- */

export type PaymentRequest = z.infer<typeof PaymentRequestZodSchema>;
export type PaymentResponse = z.infer<typeof PaymentResponseZodSchema>;
export type UpdatePaymentRequest = z.infer<
  typeof UpdatePaymentRequestZodSchema
>;
