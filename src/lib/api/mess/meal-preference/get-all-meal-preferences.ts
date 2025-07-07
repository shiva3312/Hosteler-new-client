//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { MealPreferenceResponse } from '@/interfaces/mealPreference.interface';
import { api } from '@/lib/api/api-client';
import { QueryConfig } from '@/lib/api/react-query';

export const getMealPreference = (): Promise<{
  data: MealPreferenceResponse[];
}> => {
  return api.get(`/mealPreferences`);
};

export const getMealPreferenceQueryOptions = () => {
  return queryOptions({
    queryKey: ['mealPreferences'],
    queryFn: getMealPreference,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseMealPreferenceOptions = {
  queryConfig?: QueryConfig<typeof getMealPreferenceQueryOptions>;
};

export const useMealPreferences = ({
  queryConfig,
}: UseMealPreferenceOptions = {}) => {
  return useQuery({
    ...getMealPreferenceQueryOptions(),
    ...queryConfig,
  });
};
