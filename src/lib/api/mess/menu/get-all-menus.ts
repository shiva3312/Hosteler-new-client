//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { MenuResponse } from '@/interfaces/menu.interface';
import { api } from '@/lib/api/api-client';
import { QueryConfig } from '@/lib/api/react-query';

export const getMenu = (): Promise<{
  data: MenuResponse[];
}> => {
  return api.get(`/menus`);
};

export const getMenuQueryOptions = () => {
  return queryOptions({
    queryKey: ['menus'],
    queryFn: getMenu,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseMenuOptions = {
  queryConfig?: QueryConfig<typeof getMenuQueryOptions>;
};

export const useMenus = ({ queryConfig }: UseMenuOptions = {}) => {
  return useQuery({
    ...getMenuQueryOptions(),
    ...queryConfig,
  });
};
