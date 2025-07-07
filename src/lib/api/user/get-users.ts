//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { UserResponse } from '@/interfaces/user.interface';
import { api } from '@/lib/api/api-client';
import { QueryConfig } from '@/lib/api/react-query';

export const getUsers = (
  params?: Record<string, any>,
): Promise<{ data: UserResponse[] }> => {
  return api.get(`/users`, { params });
};

export const getUsersQueryOptions = (params?: Record<string, any>) => {
  return queryOptions({
    queryKey: ['users', params], // include params in key for caching
    queryFn: () => getUsers(params),
    staleTime: 1000 * 60 * 5,
  });
};

type UseUsersOptions = {
  queryConfig?: QueryConfig<typeof getUsersQueryOptions>;
  params?: Record<string, any>;
  enabled?: boolean;
};

export const useUsers = ({
  queryConfig,
  params,
  enabled,
}: UseUsersOptions = {}) => {
  return useQuery({
    ...getUsersQueryOptions(params),
    ...queryConfig,
    enabled,
  });
};
