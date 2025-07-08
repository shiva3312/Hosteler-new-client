//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';

import { MealChartRequest } from '@/interfaces/mess/meal-chart.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useMealCharts } from './get-all-meal-charts';

export const createMealChart = ({ data }: { data: MealChartRequest }) => {
  return api.post(`/meal-chart`, data);
};

type UseCreateMealChartOptions = {
  mutationConfig?: MutationConfig<typeof createMealChart>;
};

export const useCreateMealChart = ({
  mutationConfig,
}: UseCreateMealChartOptions = {}) => {
  const { refetch: refetchMealChart } = useMealCharts();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      refetchMealChart();
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createMealChart,
  });
};
