//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { UpdateUserRequestZodSchema } from '@/interfaces/user.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useUsers } from './get-users';
import { SearchQuery } from '../search-query';

export type UpdateUserInput = z.infer<typeof UpdateUserRequestZodSchema>;

export const updateUser = ({
  userId,
  data,
}: {
  userId: string;
  data: UpdateUserInput;
}) => {
  return api.put(`/user/${userId}`, data);
};

type UseUpdateUserOptions = {
  mutationConfig?: MutationConfig<typeof updateUser>;
};

export const useUpdateUser = ({
  mutationConfig,
}: UseUpdateUserOptions = {}) => {
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
    mutationFn: updateUser,
  });
};
