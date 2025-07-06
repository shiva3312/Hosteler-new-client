//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { UserRequestZodSchema } from '@/interfaces/user.interface';
import { api } from '@/lib/api-client';
import { useUser } from '@/lib/auth';
import { MutationConfig } from '@/lib/react-query';

export type CreateUserInput = z.infer<typeof UserRequestZodSchema>;

export const updateUser = ({ data }: { data: CreateUserInput }) => {
  return api.post(`/users`, data);
};

type UseCreateUserOptions = {
  mutationConfig?: MutationConfig<typeof updateUser>;
};

export const useCreateUser = ({
  mutationConfig,
}: UseCreateUserOptions = {}) => {
  const { refetch: refetchUser } = useUser();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      refetchUser();
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateUser,
  });
};
