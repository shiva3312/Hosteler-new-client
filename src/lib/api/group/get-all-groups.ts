//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { GroupResponse } from '@/interfaces/group.interface';
import { api } from '@/lib/api/api-client';
import { QueryConfig } from '@/lib/api/react-query';

export const getGroups = (
  params?: Record<string, any>,
): Promise<{
  data: GroupResponse[];
}> => {
  return api.get(`/groups`, { params });
};

export const getGroupQueryOptions = (params?: Record<string, any>) => {
  return queryOptions({
    queryKey: ['groups', params],
    queryFn: getGroups,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseGroupOptions = {
  queryConfig?: QueryConfig<typeof getGroupQueryOptions>;
  params?: Record<string, any>;
  enabled?: boolean;
};

export const useGroups = ({
  queryConfig,
  params,
  enabled,
}: UseGroupOptions = {}) => {
  return useQuery({
    ...getGroupQueryOptions(params),
    ...queryConfig,
    enabled,
  });
};
