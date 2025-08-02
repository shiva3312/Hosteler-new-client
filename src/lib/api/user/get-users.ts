//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { UserResponse } from '@/interfaces/user.interface';
import { api } from '@/lib/api/api-client';
import { commonQueryKey, QueryConfig } from '@/lib/api/react-query';

export const getUsers = (
  params?: Record<string, any>,
): Promise<{ data: UserResponse[] }> => {
  return api.get(`/users`, { params });
};

export const getUsersQueryOptions = (
  params?: Record<string, any>,
  customKey?: string,
) => {
  return queryOptions({
    queryKey: [...commonQueryKey(), 'users', params, customKey], // include params and customKeys in key for caching
    queryFn: () => getUsers(params),
    staleTime: 1000 * 60 * 5,
  });
};

type UseUsersOptions = {
  queryConfig?: QueryConfig<typeof getUsersQueryOptions>;
  params?: Record<string, any>;
  enabled?: boolean;
  customKey?: string;
};

export const useUsers = ({
  queryConfig,
  params,
  enabled,
  customKey,
}: UseUsersOptions = {}) => {
  return useQuery({
    ...getUsersQueryOptions(params, customKey),
    ...queryConfig,
    enabled,
  });
};
