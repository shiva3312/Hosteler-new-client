//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';

import { MealPreferenceRequest } from '@/interfaces/mess/meal-preference.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useMealPreferences } from './get-all-meal-preferences';

export const createMealPreference = ({
  data,
}: {
  data: MealPreferenceRequest;
}) => {
  return api.post(`/meal-preference`, data);
};

type UseCreateMealPreferenceOptions = {
  mutationConfig?: MutationConfig<typeof createMealPreference>;
};

export const useCreateMealPreference = ({
  mutationConfig,
}: UseCreateMealPreferenceOptions = {}) => {
  const { refetch: refetchMealPreference } = useMealPreferences();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      refetchMealPreference();
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createMealPreference,
  });
};
