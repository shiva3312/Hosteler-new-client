//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { MealChartType, MenuType } from '@/interfaces/enums';
import { MealChartResponse } from '@/interfaces/mess/meal-chart.interface';
import { api } from '@/lib/api/api-client';
import { QueryConfig } from '@/lib/api/react-query';

export interface CreateToViewMealChart {
  unit: string;
  organization: string;
  menuType: MenuType;
  mealChartType: MealChartType;
}

export const getMealChartsToView = (
  params?: Record<string, any>,
): Promise<{
  data: MealChartResponse;
}> => {
  return api.get(`/meal-chart/view`, { params });
};

export const getMealChartQueryOptions = (params?: CreateToViewMealChart) => {
  return queryOptions({
    queryKey: ['/meal-chart/view', params],
    queryFn: getMealChartsToView,
    // staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseMealChartOptions = {
  queryConfig?: QueryConfig<typeof getMealChartQueryOptions>;
  params?: CreateToViewMealChart;
  enabled?: boolean;
};

export const useMealChartsToView = ({
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
