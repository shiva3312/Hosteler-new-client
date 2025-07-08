//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';

import { MealItemRequest } from '@/interfaces/mess/meal-item.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useMealItems } from './get-all-meal-items';

export const createMealItem = ({ data }: { data: MealItemRequest }) => {
  return api.post(`/meal-item`, data);
};

type UseCreateMealItemOptions = {
  mutationConfig?: MutationConfig<typeof createMealItem>;
};

export const useCreateMealItem = ({
  mutationConfig,
}: UseCreateMealItemOptions = {}) => {
  const { refetch: refetchMealItem } = useMealItems();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      refetchMealItem();
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createMealItem,
  });
};
