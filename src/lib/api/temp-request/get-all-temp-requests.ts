//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { TempRequestResponse } from '@/interfaces/temp-request.interface';
import { api } from '@/lib/api/api-client';
import { commonQueryKey, QueryConfig } from '@/lib/api/react-query';

export const getTempRequests = (
  params?: Record<string, any>,
): Promise<{
  data: TempRequestResponse[];
}> => {
  return api.get(`/temp-requests`, { params });
};

export const getTempRequestQueryOptions = (params?: Record<string, any>) => {
  return queryOptions({
    queryKey: [...commonQueryKey(), 'temp-requests', params],
    queryFn: getTempRequests,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseTempRequestOptions = {
  queryConfig?: QueryConfig<typeof getTempRequestQueryOptions>;
  params?: Record<string, any>;
  enabled?: boolean;
};

export const useTempRequests = ({
  queryConfig,
  params,
  enabled,
}: UseTempRequestOptions = {}) => {
  return useQuery({
    ...getTempRequestQueryOptions(params),
    ...queryConfig,
    enabled,
  });
};
