//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { UserResponse } from '@/interfaces/user.interface';
import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

export const getUsers = (): Promise<{ data: UserResponse[] }> => {
  return api.get(`/users`);
};

export const getUsersQueryOptions = () => {
  return queryOptions({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseUsersOptions = {
  queryConfig?: QueryConfig<typeof getUsersQueryOptions>;
};

export const useUsers = ({ queryConfig }: UseUsersOptions = {}) => {
  return useQuery({
    ...getUsersQueryOptions(),
    ...queryConfig,
  });
};
