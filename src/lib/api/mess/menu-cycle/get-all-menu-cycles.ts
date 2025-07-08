//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { MenuCycleResponse } from '@/interfaces/mess/menu-cycle.interface';
import { api } from '@/lib/api/api-client';
import { QueryConfig } from '@/lib/api/react-query';

export const getMenuCycles = (
  params?: Record<string, any>,
): Promise<{
  data: MenuCycleResponse[];
}> => {
  return api.get(`/menu-cycles`, { params });
};

export const getMenuCycleQueryOptions = (params?: Record<string, any>) => {
  return queryOptions({
    queryKey: ['menuCycles', params],
    queryFn: getMenuCycles,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseMessOptions = {
  queryConfig?: QueryConfig<typeof getMenuCycleQueryOptions>;
  params?: Record<string, any>;
  enabled?: boolean;
};

export const useMenuCycles = ({
  queryConfig,
  params,
  enabled,
}: UseMessOptions = {}) => {
  return useQuery({
    ...getMenuCycleQueryOptions(params),
    ...queryConfig,
    enabled,
  });
};
