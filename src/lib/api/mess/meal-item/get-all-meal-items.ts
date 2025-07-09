//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { MealItemResponse } from '@/interfaces/mess/meal-item.interface';
import { api } from '@/lib/api/api-client';
import { QueryConfig } from '@/lib/api/react-query';

export const getMealItems = (
  params?: Record<string, any>,
): Promise<{
  data: MealItemResponse[];
}> => {
  return api.get(`/meal-items`, { params });
};

export const getMealItemQueryOptions = (params?: Record<string, any>) => {
  return queryOptions({
    queryKey: ['meal-items', params],
    queryFn: getMealItems,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseMessOptions = {
  queryConfig?: QueryConfig<typeof getMealItemQueryOptions>;
  params?: Record<string, any>;
  enabled?: boolean;
};

export const useMealItems = ({
  queryConfig,
  params,
  enabled,
}: UseMessOptions = {}) => {
  return useQuery({
    ...getMealItemQueryOptions(params),
    ...queryConfig,
    enabled,
  });
};
