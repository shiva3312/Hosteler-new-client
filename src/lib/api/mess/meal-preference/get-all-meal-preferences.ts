//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { MealPreferenceResponse } from '@/interfaces/mess/meal-preference.interface';
import { api } from '@/lib/api/api-client';
import { QueryConfig } from '@/lib/api/react-query';

export const getMealPreferences = (
  params?: Record<string, any>,
): Promise<{
  data: MealPreferenceResponse[];
}> => {
  return api.get(`/meal-preferences`, { params });
};

export const getMealPreferenceQueryOptions = (params?: Record<string, any>) => {
  return queryOptions({
    queryKey: ['meal-preferences', params],
    queryFn: getMealPreferences,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseMessOptions = {
  queryConfig?: QueryConfig<typeof getMealPreferenceQueryOptions>;
  params?: Record<string, any>;
  enabled?: boolean;
};

export const useMealPreferences = ({
  queryConfig,
  params,
  enabled,
}: UseMessOptions = {}) => {
  return useQuery({
    ...getMealPreferenceQueryOptions(params),
    ...queryConfig,
    enabled,
  });
};
