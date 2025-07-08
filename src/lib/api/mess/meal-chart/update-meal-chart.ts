//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';

import { UpdateMealChartRequest } from '@/interfaces/mess/meal-chart.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useMealCharts } from './get-all-meal-charts';

export const updateMealChart = ({
  mealChartId,
  data,
}: {
  mealChartId: string;
  data: UpdateMealChartRequest;
}) => {
  return api.put(`/mealChart/${mealChartId}`, data);
};

type UseUpdateMealChartOptions = {
  mutationConfig?: MutationConfig<typeof updateMealChart>;
};

export const useUpdateMealChart = ({
  mutationConfig,
}: UseUpdateMealChartOptions) => {
  const { refetch: refetchMealChart } = useMealCharts();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      refetchMealChart();
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateMealChart,
  });
};
