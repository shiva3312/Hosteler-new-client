//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { getMealItemQueryOptions } from './get-all-mealItems';

export type DeleteMealItemDTO = {
  mealItemId: string;
};

export const deleteMealItem = ({ mealItemId }: DeleteMealItemDTO) => {
  return api.delete(`/mealItem/${mealItemId}`);
};

type UseDeleteMealItemOptions = {
  mutationConfig?: MutationConfig<typeof deleteMealItem>;
};

export const useDeleteMealItem = ({
  mutationConfig,
}: UseDeleteMealItemOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getMealItemQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteMealItem,
  });
};
