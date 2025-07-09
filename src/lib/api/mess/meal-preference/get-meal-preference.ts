//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { MealPreferenceResponse } from '@/interfaces/mess/meal-preference.interface';
import { api } from '@/lib/api/api-client';
import { QueryConfig } from '@/lib/api/react-query';

export const getMealPreferenceById = (
  mealPreference: string,
): Promise<{
  data: MealPreferenceResponse[];
}> => {
  return api.get(`/meal-preference/${mealPreference}`);
};

export const getMealPreferenceQueryOptions = (mealPreference: string) => {
  return queryOptions({
    queryKey: ['meal-preference', mealPreference],
    queryFn: () => getMealPreferenceById(mealPreference),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseMealPreferenceOptions = {
  mealPreference: string;
  queryConfig?: QueryConfig<typeof getMealPreferenceQueryOptions>;
  enabled?: boolean;
};

export const useMealPreference = ({
  mealPreference,
  queryConfig,
  enabled,
}: UseMealPreferenceOptions) => {
  return useQuery({
    ...getMealPreferenceQueryOptions(mealPreference),
    ...queryConfig,
    enabled,
  });
};
