//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';

import { MealItemRequest } from '@/interfaces/mealItem.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useMealItems } from './get-all-mealItems';

export const updateMealItem = ({ data }: { data: MealItemRequest }) => {
  return api.post(`/mealItem`, data);
};

type UseCreateMealItemOptions = {
  mutationConfig?: MutationConfig<typeof updateMealItem>;
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
    mutationFn: updateMealItem,
  });
};
