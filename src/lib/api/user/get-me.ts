//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { UserResponse } from '@/interfaces/user.interface';
import { api } from '@/lib/api/api-client';

import { QueryConfig } from '../react-query';

export const getMeById = (): Promise<{ data: UserResponse }> => {
  return api.get(`/user/me`);
};

export const getMeQueryOptions = () => {
  return queryOptions({
    queryKey: ['me'],
    queryFn: () => getMeById(),
    staleTime: 1000 * 60 * 60, // 1h minutes
  });
};

type UseMeOptions = {
  queryConfig?: QueryConfig<typeof getMeQueryOptions>;
  params?: Record<string, any>;
  enabled?: boolean;
};

export const useMe = (options?: UseMeOptions) => {
  return useQuery({
    ...getMeQueryOptions(),
    ...options?.queryConfig,
    enabled: options?.enabled,
  });
};
