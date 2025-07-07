//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { GroupResponse } from '@/interfaces/group.interface';
import { api } from '@/lib/api/api-client';
import { QueryConfig } from '@/lib/api/react-query';

export const getGroupById = (
  group: string,
): Promise<{
  data: GroupResponse[];
}> => {
  return api.get(`/group/${group}`);
};

export const getGroupQueryOptions = (group: string) => {
  return queryOptions({
    queryKey: ['group'],
    queryFn: () => getGroupById(group),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseGroupOptions = {
  group: string;
  queryConfig?: QueryConfig<typeof getGroupQueryOptions>;
};

export const useGroups = ({ group, queryConfig }: UseGroupOptions) => {
  return useQuery({
    ...getGroupQueryOptions(group),
    ...queryConfig,
  });
};
