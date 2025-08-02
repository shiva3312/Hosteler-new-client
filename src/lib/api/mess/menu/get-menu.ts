//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { MenuResponse } from '@/interfaces/mess/menu.interface';
import { api } from '@/lib/api/api-client';
import { commonQueryKey, QueryConfig } from '@/lib/api/react-query';

export const getMenuById = (
  menu: string,
): Promise<{
  data: MenuResponse[];
}> => {
  return api.get(`/menu/${menu}`);
};

export const getMenuQueryOptions = (menu: string) => {
  return queryOptions({
    queryKey: [...commonQueryKey(), 'menu', menu],
    queryFn: () => getMenuById(menu),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseMenuOptions = {
  menu: string;
  queryConfig?: QueryConfig<typeof getMenuQueryOptions>;
  enabled?: boolean;
};

export const useMenu = ({ menu, queryConfig, enabled }: UseMenuOptions) => {
  return useQuery({
    ...getMenuQueryOptions(menu),
    ...queryConfig,
    enabled,
  });
};
