//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { GroupResponse } from '@/interfaces/group.interface';
import { api } from '@/lib/api/api-client';
import { QueryConfig } from '@/lib/api/react-query';

export const getGroup = (): Promise<{
  data: GroupResponse[];
}> => {
  return api.get(`/groups`);
};

export const getGroupQueryOptions = () => {
  return queryOptions({
    queryKey: ['groups'],
    queryFn: getGroup,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseGroupOptions = {
  queryConfig?: QueryConfig<typeof getGroupQueryOptions>;
};

export const useGroups = ({ queryConfig }: UseGroupOptions = {}) => {
  return useQuery({
    ...getGroupQueryOptions(),
    ...queryConfig,
  });
};
