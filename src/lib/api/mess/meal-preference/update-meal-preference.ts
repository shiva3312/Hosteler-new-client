//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';

import { UpdateMealPreferenceRequest } from '@/interfaces/mess/meal-preference.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useMealPreferences } from './get-all-meal-preferences';

export const updateMealPreference = ({
  mealPreferenceId,
  data,
}: {
  mealPreferenceId: string;
  data: UpdateMealPreferenceRequest;
}) => {
  return api.put(`/meal-preference/${mealPreferenceId}`, data);
};

type UseUpdateMealPreferenceOptions = {
  mutationConfig?: MutationConfig<typeof updateMealPreference>;
};

export const useUpdateMealPreference = ({
  mutationConfig,
}: UseUpdateMealPreferenceOptions) => {
  const { refetch: refetchMealPreference } = useMealPreferences();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      refetchMealPreference();
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateMealPreference,
  });
};
