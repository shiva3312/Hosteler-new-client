//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { getMealPreferenceQueryOptions } from './get-all-meal-preferences';

export type DeleteMealPreferenceDTO = {
  mealPreferenceId: string;
};

export const deleteMealPreference = ({
  mealPreferenceId,
}: DeleteMealPreferenceDTO) => {
  return api.delete(`/mealPreference/${mealPreferenceId}`);
};

type UseDeleteMealPreferenceOptions = {
  mutationConfig?: MutationConfig<typeof deleteMealPreference>;
};

export const useDeleteMealPreference = ({
  mutationConfig,
}: UseDeleteMealPreferenceOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getMealPreferenceQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteMealPreference,
  });
};
