//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { FilterHistoryParams, UserAction } from '@/interfaces/common.interface';
import { api } from '@/lib/api/api-client';
import { commonQueryKey, QueryConfig } from '@/lib/api/react-query';

export const getUserHistoryById = (
  id: string,
  params?: FilterHistoryParams,
): Promise<{
  data: UserAction[];
}> => {
  console.log('Fetching user history for ID:', id, 'with params:', params);
  return api.get(`/user/${id}/history`, { params });
};

export const getUserHistoryQueryOptions = (
  id: string,
  params?: FilterHistoryParams,
) => {
  return queryOptions({
    queryKey: [...commonQueryKey(), 'user-history', id, params],
    queryFn: () => getUserHistoryById(id, params),
    staleTime: 1000 * 60,
  });
};

type UseUserHistoryOptions = {
  id: string;
  params?: FilterHistoryParams;
  queryConfig?: QueryConfig<typeof getUserHistoryQueryOptions>;
};

export const useUserHistory = ({
  id,
  params,
  queryConfig,
}: UseUserHistoryOptions) => {
  return useQuery({
    ...getUserHistoryQueryOptions(id, params),
    ...queryConfig,
  });
};
