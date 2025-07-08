//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { MealChartResponse } from '@/interfaces/mess/meal-chart.interface';
import { api } from '@/lib/api/api-client';
import { QueryConfig } from '@/lib/api/react-query';

export const getMealCharts = (
  params?: Record<string, any>,
): Promise<{
  data: MealChartResponse[];
}> => {
  return api.get(`/meal-items`, { params });
};

export const getMealChartQueryOptions = (params?: Record<string, any>) => {
  return queryOptions({
    queryKey: ['mealCharts', params],
    queryFn: getMealCharts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseMealChartOptions = {
  queryConfig?: QueryConfig<typeof getMealChartQueryOptions>;
  params?: Record<string, any>;
  enabled?: boolean;
};

export const useMealCharts = ({
  queryConfig,
  params,
  enabled,
}: UseMealChartOptions = {}) => {
  return useQuery({
    ...getMealChartQueryOptions(params),
    ...queryConfig,
    enabled,
  });
};
