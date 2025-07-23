//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { UserRequestZodSchema } from '@/interfaces/user.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

export type CreateUserInput = z.infer<typeof UserRequestZodSchema>;

export const createUser = ({
  data,
  unitName,
  token,
}: {
  data: CreateUserInput;
  unitName: string;
  token: string;
}) => {
  return api.post(`/register-user-by-link/${unitName}/${token}`, data);
};

type UseCreateUserOptions = {
  mutationConfig?: MutationConfig<typeof createUser>;
};

export const useRegisterUserByLink = ({
  mutationConfig,
}: UseCreateUserOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: (variables: {
      data: CreateUserInput;
      unitName: string;
      token: string;
    }) => createUser(variables),
  });
};
