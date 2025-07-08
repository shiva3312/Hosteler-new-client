//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { UnitResponse } from '@/interfaces/unit.interface';
import { api } from '@/lib/api/api-client';
import { QueryConfig } from '@/lib/api/react-query';

export const getUnits = (
  params?: Record<string, any>,
): Promise<{
  data: UnitResponse[];
}> => {
  return api.get(`/units`, { params });
};

export const getUnitQueryOptions = (params?: Record<string, any>) => {
  return queryOptions({
    queryKey: ['units', params],
    queryFn: getUnits,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseUnitOptions = {
  queryConfig?: QueryConfig<typeof getUnitQueryOptions>;
  params?: Record<string, any>;
  enabled?: boolean;
};

export const useUnits = ({
  queryConfig,
  params,
  enabled,
}: UseUnitOptions = {}) => {
  return useQuery({
    ...getUnitQueryOptions(params),
    ...queryConfig,
    enabled,
  });
};
