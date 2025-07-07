//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { MealItemResponse } from '@/interfaces/mealItem.interface';
import { api } from '@/lib/api/api-client';
import { QueryConfig } from '@/lib/api/react-query';

export const getMealItem = (): Promise<{
  data: MealItemResponse[];
}> => {
  return api.get(`/mealItems`);
};

export const getMealItemQueryOptions = () => {
  return queryOptions({
    queryKey: ['mealItems'],
    queryFn: getMealItem,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseMealItemOptions = {
  queryConfig?: QueryConfig<typeof getMealItemQueryOptions>;
};

export const useMealItems = ({ queryConfig }: UseMealItemOptions = {}) => {
  return useQuery({
    ...getMealItemQueryOptions(),
    ...queryConfig,
  });
};
