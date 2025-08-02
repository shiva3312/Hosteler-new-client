//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { UnitResponse } from '@/interfaces/unit.interface';
import { api } from '@/lib/api/api-client';
import { commonQueryKey, QueryConfig } from '@/lib/api/react-query';

export const getUnitById = (
  unit: string,
): Promise<{
  data: UnitResponse;
}> => {
  return api.get(`/unit/${unit}`);
};

export const getUnitQueryOptions = (unit: string) => {
  return queryOptions({
    queryKey: [...commonQueryKey(), 'unit', unit],
    queryFn: () => getUnitById(unit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseUnitOptions = {
  unit: string;
  queryConfig?: QueryConfig<typeof getUnitQueryOptions>;
  enabled?: boolean;
};

export const useUnit = ({ unit, queryConfig, enabled }: UseUnitOptions) => {
  return useQuery({
    ...getUnitQueryOptions(unit),
    ...queryConfig,
    enabled,
  });
};
