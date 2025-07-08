//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { MenuResponse } from '@/interfaces/mess/menu.interface';
import { api } from '@/lib/api/api-client';
import { QueryConfig } from '@/lib/api/react-query';

export const getMenus = (
  params?: Record<string, any>,
): Promise<{
  data: MenuResponse[];
}> => {
  return api.get(`/menues`, { params });
};

export const getMenuQueryOptions = (params?: Record<string, any>) => {
  return queryOptions({
    queryKey: ['menus', params],
    queryFn: getMenus,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseMenuOptions = {
  queryConfig?: QueryConfig<typeof getMenuQueryOptions>;
  params?: Record<string, any>;
  enabled?: boolean;
};

export const useMenues = ({
  queryConfig,
  params,
  enabled,
}: UseMenuOptions = {}) => {
  return useQuery({
    ...getMenuQueryOptions(params),
    ...queryConfig,
    enabled,
  });
};
