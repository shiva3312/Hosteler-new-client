//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { MealChartResponse } from '@/interfaces/mess/meal-chart.interface';
import { api } from '@/lib/api/api-client';
import { commonQueryKey, QueryConfig } from '@/lib/api/react-query';

export const getMealChartById = (
  id: string,
): Promise<{
  data: MealChartResponse[];
}> => {
  return api.get(`/meal-chart/${id}`);
};

export const getMealChartQueryOptions = (mealChart: string) => {
  return queryOptions({
    queryKey: [...commonQueryKey(), 'meal-chart', mealChart],
    queryFn: () => getMealChartById(mealChart),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseMealChartOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getMealChartQueryOptions>;
  enabled?: boolean;
};

export const useMealChart = ({
  id,
  queryConfig,
  enabled,
}: UseMealChartOptions) => {
  return useQuery({
    ...getMealChartQueryOptions(id),
    ...queryConfig,
    enabled,
  });
};
