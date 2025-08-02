//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { GroupResponse } from '@/interfaces/group.interface';
import { api } from '@/lib/api/api-client';
import { commonQueryKey, QueryConfig } from '@/lib/api/react-query';

export const getGroupById = (
  group: string,
): Promise<{
  data: GroupResponse[];
}> => {
  return api.get(`/group/${group}`);
};

export const getGroupQueryOptions = (group: string) => {
  return queryOptions({
    queryKey: [...commonQueryKey(), 'group', group],
    queryFn: () => getGroupById(group),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseGroupOptions = {
  group: string;
  queryConfig?: QueryConfig<typeof getGroupQueryOptions>;
  enabled?: boolean;
};

export const useGroup = ({ group, queryConfig, enabled }: UseGroupOptions) => {
  return useQuery({
    ...getGroupQueryOptions(group),
    ...queryConfig,
    enabled,
  });
};
