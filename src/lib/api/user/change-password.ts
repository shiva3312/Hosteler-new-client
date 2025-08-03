//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { ChangePasswordRequestZodSchema } from '@/interfaces/auth.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

export type ChangePasswordInput = z.infer<
  typeof ChangePasswordRequestZodSchema
>;

export const changePassword = ({
  userId,
  data,
}: {
  userId: string;
  data: ChangePasswordInput;
}) => {
  return api.put(`/user/change-password/${userId}`, data);
};

type UseChangePasswordOptions = {
  mutationConfig?: MutationConfig<typeof changePassword>;
};

export const useChangePassword = ({
  mutationConfig,
}: UseChangePasswordOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: changePassword,
  });
};
