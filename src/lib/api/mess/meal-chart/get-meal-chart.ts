//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { MealChartResponse } from '@/interfaces/mess/meal-chart.interface';
import { api } from '@/lib/api/api-client';
import { QueryConfig } from '@/lib/api/react-query';

export const getMealChartById = (
  mealChart: string,
): Promise<{
  data: MealChartResponse[];
}> => {
  return api.get(`/mealChart/${mealChart}`);
};

export const getMealChartQueryOptions = (mealChart: string) => {
  return queryOptions({
    queryKey: ['mealChart', mealChart],
    queryFn: () => getMealChartById(mealChart),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseMealChartOptions = {
  mealChart: string;
  queryConfig?: QueryConfig<typeof getMealChartQueryOptions>;
  enabled?: boolean;
};

export const useMealChart = ({
  mealChart,
  queryConfig,
  enabled,
}: UseMealChartOptions) => {
  return useQuery({
    ...getMealChartQueryOptions(mealChart),
    ...queryConfig,
    enabled,
  });
};
