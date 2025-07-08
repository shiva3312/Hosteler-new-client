//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { getMealChartQueryOptions } from './get-all-meal-charts';

export type DeleteMealChartDTO = {
  mealChartId: string;
};

export const deleteMealChart = ({ mealChartId }: DeleteMealChartDTO) => {
  return api.delete(`/mealChart/${mealChartId}`);
};

type UseDeleteMealChartOptions = {
  mutationConfig?: MutationConfig<typeof deleteMealChart>;
};

export const useDeleteMealChart = ({
  mutationConfig,
}: UseDeleteMealChartOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getMealChartQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteMealChart,
  });
};
