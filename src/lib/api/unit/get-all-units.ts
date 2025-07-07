//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { UnitResponse } from '@/interfaces/unit.interface';
import { api } from '@/lib/api/api-client';
import { QueryConfig } from '@/lib/api/react-query';

export const getUnit = (): Promise<{
  data: UnitResponse[];
}> => {
  return api.get(`/units`);
};

export const getUnitQueryOptions = () => {
  return queryOptions({
    queryKey: ['units'],
    queryFn: getUnit,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseUnitOptions = {
  queryConfig?: QueryConfig<typeof getUnitQueryOptions>;
};

export const useUnits = ({ queryConfig }: UseUnitOptions = {}) => {
  return useQuery({
    ...getUnitQueryOptions(),
    ...queryConfig,
  });
};
