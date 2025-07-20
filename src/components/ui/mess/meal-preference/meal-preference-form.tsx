//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Button, Grid, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { isEmpty } from 'lodash';

import logger from '@/config/log';
import { MealType, MenuType } from '@/interfaces/enums';
import {
  MealPreferenceRequest,
  MealPreferenceResponse,
} from '@/interfaces/mess/meal-preference.interface';
import { useCreateMealPreference } from '@/lib/api/mess/meal-preference/create-meal-preference';
import { useUpdateMealPreference } from '@/lib/api/mess/meal-preference/update-meal-preference';

import OrganizationUnitDropdown from '../../core/dropdown/organization-unit-selector';
import UserDropdown from '../../core/dropdown/user-selector';
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
      <OrganizationUnitDropdown form={form} />

      <UserDropdown form={form} />
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            required={false}
            label="Menu Type"
            key={form.key('menuType')}
            placeholder="Select your menu type"
            data={Object.values(MenuType).map((value) => ({
              value,
              label: value,
            }))}
            {...form.getInputProps('menuType')}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            required={false}
            label="Meal Preference"
            key={form.key('mealType')}
            placeholder="Select your meal preference"
            data={Object.values(MealType).map((value) => ({
              value,
              label: value,
            }))}
            {...form.getInputProps('mealType')}
          />
        </Grid.Col>
      </Grid>
      <Button type="submit" mt="md">
        {initialValues ? 'Update' : 'Create'}
      </Button>
    </form>
  );
}
