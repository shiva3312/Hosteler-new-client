//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';

import { MealPreferenceRequest } from '@/interfaces/mealPreference.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useMealPreferences } from './get-all-mealPreferences';

export const updateMealPreference = ({
  data,
}: {
  data: MealPreferenceRequest;
}) => {
  return api.post(`/mealPreference`, data);
};

type UseCreateMealPreferenceOptions = {
  mutationConfig?: MutationConfig<typeof updateMealPreference>;
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
    mutationFn: updateMealPreference,
  });
};
