//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { UserRequestZodSchema } from '@/interfaces/user.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useUsers } from './get-users';
import { SearchQuery } from '../search-query';

export type CreateUserInput = z.infer<typeof UserRequestZodSchema>;

export const createUser = ({ data }: { data: CreateUserInput }) => {
  return api.post(`/user`, data);
};

type UseCreateUserOptions = {
  mutationConfig?: MutationConfig<typeof createUser>;
};

export const useCreateUser = ({
  mutationConfig,
}: UseCreateUserOptions = {}) => {
  const { refetch: refetchUser } = useUsers({
    params: SearchQuery.userSearchQuery({}),
  });

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      refetchUser();
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createUser,
  });
};
