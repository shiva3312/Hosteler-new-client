//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { TextInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { isEmpty } from 'lodash';

import {
  MealChartRequest,
  MealChartResponse,
} from '@/interfaces/mess/meal-chart.interface';
import { useCreateMealChart } from '@/lib/api/mess/meal-chart/create-meal-chart';
import { useUpdateMealChart } from '@/lib/api/mess/meal-chart/update-meal-chart';

import { useNotifications } from '../../core/notifications';

interface Props {
  initialValues?: Partial<MealChartResponse>;
}

export function MealChartForm({ initialValues }: Props) {
  const form = useForm({
    initialValues,
    // validate : MealChartRequestZodSchema
  });
  const { addNotification } = useNotifications();

  const updateMealChartMutation = useUpdateMealChart({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'MealChart Updated',
        });
      },
    },
  });

  const createMealChartMutation = useCreateMealChart({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'MealChart Created',
        });
      },
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    if (isEmpty(initialValues)) {
      // validate the form values before proceeding

      // Handle create mealChart logic
      createMealChartMutation.mutate({
        data: values as MealChartRequest,
      });
      console.log('Creating mealChart with values:', values);
    } else {
      updateMealChartMutation.mutate({
        mealChartId: (initialValues as MealChartResponse)?._id,
        data: values as Partial<MealChartRequest>,
      });

      console.log('Updating mealChart with values:', values);
    }
    // Add logic to handle form submission, e.g., API call
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="MealChart Name"
        placeholder="Enter mealChart name"
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
        {initialValues ? 'Update' : 'Create'}
      </Button>
    </form>
  );
}
