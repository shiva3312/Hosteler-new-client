//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { MessResponse } from '@/interfaces/mess/mess.interface';
import { api } from '@/lib/api/api-client';
import { QueryConfig } from '@/lib/api/react-query';

export const getMesses = (
  params?: Record<string, any>,
): Promise<{
  data: MessResponse[];
}> => {
  return api.get(`/messes`, { params });
};

export const getMessQueryOptions = (params?: Record<string, any>) => {
  return queryOptions({
    queryKey: ['messes', params],
    queryFn: getMesses,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseMessOptions = {
  queryConfig?: QueryConfig<typeof getMessQueryOptions>;
  params?: Record<string, any>;
  enabled?: boolean;
};

export const useMesses = ({
  queryConfig,
  params,
  enabled,
}: UseMessOptions = {}) => {
  return useQuery({
    ...getMessQueryOptions(params),
    ...queryConfig,
    enabled,
  });
};
