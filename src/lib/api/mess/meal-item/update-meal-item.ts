//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';

import { UpdateMealItemRequest } from '@/interfaces/mealItem.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useMealItems } from './get-all-mealItems';

export const updateMealItem = ({
  mealItemId,
  data,
}: {
  mealItemId: string;
  data: UpdateMealItemRequest;
}) => {
  return api.put(`/mealItem/${mealItemId}`, data);
};

type UseUpdateMealItemOptions = {
  mealItemId: string;
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
