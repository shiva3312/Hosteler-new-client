//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { MenuCycleResponse } from '@/interfaces/menuCycle.interface';
import { api } from '@/lib/api/api-client';
import { QueryConfig } from '@/lib/api/react-query';

export const getMenuCycle = (): Promise<{
  data: MenuCycleResponse[];
}> => {
  return api.get(`/menuCycles`);
};

export const getMenuCycleQueryOptions = () => {
  return queryOptions({
    queryKey: ['menuCycles'],
    queryFn: getMenuCycle,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseMenuCycleOptions = {
  queryConfig?: QueryConfig<typeof getMenuCycleQueryOptions>;
};

export const useMenuCycles = ({ queryConfig }: UseMenuCycleOptions = {}) => {
  return useQuery({
    ...getMenuCycleQueryOptions(),
    ...queryConfig,
  });
};
