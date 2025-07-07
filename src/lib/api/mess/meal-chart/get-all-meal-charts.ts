//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { MealChartResponse } from '@/interfaces/mealChart.interface';
import { api } from '@/lib/api/api-client';
import { QueryConfig } from '@/lib/api/react-query';

export const getMealChart = (): Promise<{
  data: MealChartResponse[];
}> => {
  return api.get(`/mealCharts`);
};

export const getMealChartQueryOptions = () => {
  return queryOptions({
    queryKey: ['mealCharts'],
    queryFn: getMealChart,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseMealChartOptions = {
  queryConfig?: QueryConfig<typeof getMealChartQueryOptions>;
};

export const useMealCharts = ({ queryConfig }: UseMealChartOptions = {}) => {
  return useQuery({
    ...getMealChartQueryOptions(),
    ...queryConfig,
  });
};
