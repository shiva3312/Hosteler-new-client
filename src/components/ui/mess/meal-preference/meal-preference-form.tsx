//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { TextInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { isEmpty } from 'lodash';

import logger from '@/config/log';
import {
  MealPreferenceRequest,
  MealPreferenceResponse,
} from '@/interfaces/mess/meal-preference.interface';
import { useCreateMealPreference } from '@/lib/api/mess/meal-preference/create-meal-preference';
import { useUpdateMealPreference } from '@/lib/api/mess/meal-preference/update-meal-preference';

import { useNotifications } from '../../core/notifications';

interface Props {
  initialValues?: Partial<MealPreferenceResponse>;
}

export function MealPreferenceForm({ initialValues }: Props) {
  const form = useForm({
    initialValues,
    // validate : MealPreferenceRequestZodSchema
  });
  const { addNotification } = useNotifications();

  const updateMealPreferenceMutation = useUpdateMealPreference({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'MealPreference Updated',
        });
      },
    },
  });

  const createMealPreferenceMutation = useCreateMealPreference({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'MealPreference Created',
        });
      },
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    if (isEmpty(initialValues)) {
      // Handle create mealPreference logic
      createMealPreferenceMutation.mutate({
        data: values as MealPreferenceRequest,
      });
      logger.info('Creating mealPreference with values:', values);
    } else {
      updateMealPreferenceMutation.mutate({
        mealPreferenceId: (initialValues as MealPreferenceResponse)?._id,
        data: values as MealPreferenceRequest,
      });

      logger.info('Updating mealPreference with values:', values);
    }
    // Add logic to handle form submission, e.g., API call
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="MealPreference Name"
        placeholder="Enter mealPreference name"
        {...form.getInputProps('name')}
        required
      />
      <TextInput
        label="Description"
        placeholder="Enter description"
        {...form.getInputProps('description')}
        required
      />
      <Button type="submit" mt="md">
        {initialValues ? 'Edit MealPreference' : 'Create MealPreference'}
      </Button>
    </form>
  );
}
