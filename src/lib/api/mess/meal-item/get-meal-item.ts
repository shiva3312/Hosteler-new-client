//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { MealItemResponse } from '@/interfaces/mealItem.interface';
import { api } from '@/lib/api/api-client';
import { QueryConfig } from '@/lib/api/react-query';

export const getMealItemById = (
  mealItem: string,
): Promise<{
  data: MealItemResponse[];
}> => {
  return api.get(`/mealItem/${mealItem}`);
};

export const getMealItemQueryOptions = (mealItem: string) => {
  return queryOptions({
    queryKey: ['mealItem'],
    queryFn: () => getMealItemById(mealItem),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseMealItemOptions = {
  mealItem: string;
  queryConfig?: QueryConfig<typeof getMealItemQueryOptions>;
};

export const useMealItems = ({ mealItem, queryConfig }: UseMealItemOptions) => {
  return useQuery({
    ...getMealItemQueryOptions(mealItem),
    ...queryConfig,
  });
};
