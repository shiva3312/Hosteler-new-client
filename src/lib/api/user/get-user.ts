//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { UserResponse } from '@/interfaces/user.interface';
import { api } from '@/lib/api/api-client';
import { QueryConfig } from '@/lib/api/react-query';

export const getUserById = (
  user: string,
): Promise<{
  data: UserResponse;
}> => {
  return api.get(`/user/${user}`);
};

export const getUserQueryOptions = (user: string) => {
  return queryOptions({
    queryKey: ['user', user],
    queryFn: () => getUserById(user),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseUserOptions = {
  user: string;
  queryConfig?: QueryConfig<typeof getUserQueryOptions>;
};

export const useUser = ({ user, queryConfig }: UseUserOptions) => {
  return useQuery({
    ...getUserQueryOptions(user),
    ...queryConfig,
  });
};
