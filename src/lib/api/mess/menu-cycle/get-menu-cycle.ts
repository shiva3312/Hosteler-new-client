//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { MenuCycleResponse } from '@/interfaces/mess/menu-cycle.interface';
import { api } from '@/lib/api/api-client';
import { QueryConfig } from '@/lib/api/react-query';

export const getMenuCycleById = (
  menuCycle: string,
): Promise<{
  data: MenuCycleResponse[];
}> => {
  return api.get(`/menuCycle/${menuCycle}`);
};

export const getMenuCycleQueryOptions = (menuCycle: string) => {
  return queryOptions({
    queryKey: ['menuCycle', menuCycle],
    queryFn: () => getMenuCycleById(menuCycle),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseMenuCycleOptions = {
  menuCycle: string;
  queryConfig?: QueryConfig<typeof getMenuCycleQueryOptions>;
};

export const useMenuCycle = ({
  menuCycle,
  queryConfig,
  enabled,
}: UseMenuCycleOptions & { enabled?: boolean }) => {
  return useQuery({
    ...getMenuCycleQueryOptions(menuCycle),
    ...queryConfig,
    enabled,
  });
};
