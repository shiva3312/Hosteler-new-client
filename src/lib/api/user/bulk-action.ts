//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { GeneralAction } from '@/data/feature';
import {
  UserResponse,
  UserResponseZodSchema,
} from '@/interfaces/user.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { SearchQuery } from '../search-query';
import { useUsers } from './get-users';

const UpdateUserRequestZodSchema = UserResponseZodSchema.partial();

export type UpdateUserBulkInput = z.infer<typeof UpdateUserRequestZodSchema>;

export const updateUserBulk = ({
  action,
  data,
}: {
  action: GeneralAction;
  data: Partial<UserResponse>[];
}) => {
  return api.post(`/user/bulk/${action}`, data);
};

type useUserBulkActionOptions = {
  mutationConfig?: MutationConfig<typeof updateUserBulk>;
};

export const useUserBulkAction = ({
  mutationConfig,
}: useUserBulkActionOptions = {}) => {
  const { refetch: refetchUserBulk } = useUsers({
    params: SearchQuery.userSearchQuery({}),
  });

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      refetchUserBulk();
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateUserBulk,
  });
};
