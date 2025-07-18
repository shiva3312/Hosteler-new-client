//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';

import { UpdateMealItemRequest } from '@/interfaces/mess/meal-item.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useMealItems } from './get-all-meal-items';

export const updateMealItem = ({
  mealItemId,
  data,
}: {
  mealItemId: string;
  data: UpdateMealItemRequest;
}) => {
  return api.put(`/meal-item/${mealItemId}`, data);
};

type UseUpdateMealItemOptions = {
  mutationConfig?: MutationConfig<typeof updateMealItem>;
};

export const useUpdateMealItem = ({
  mutationConfig,
}: UseUpdateMealItemOptions) => {
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
