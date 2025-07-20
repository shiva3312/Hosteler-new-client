//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Divider, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { isEmpty } from 'lodash';

import logger from '@/config/log';
import { MealChartType, MenuType } from '@/interfaces/enums';
import {
  MealChartRequest,
  MealChartResponse,
} from '@/interfaces/mess/meal-chart.interface';
import { useCreateMealChart } from '@/lib/api/mess/meal-chart/create-meal-chart';
import { useUpdateMealChart } from '@/lib/api/mess/meal-chart/update-meal-chart';

import MealChartView from './meal-chart-view';
import OrganizationUnitDropdown from '../../core/dropdown/organization-unit-selector';
import { useNotifications } from '../../core/notifications';

interface Props {
  initialValues?: Partial<MealChartResponse>;
}

export function MealChartForm({ initialValues }: Props) {
  const form = useForm({
    initialValues: { menuType: MenuType.Dinner, ...initialValues },
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
      logger.info('Creating mealChart with values:', values);
    } else {
      updateMealChartMutation.mutate({
        mealChartId: (initialValues as MealChartResponse)?._id,
        data: values as Partial<MealChartRequest>,
      });

      logger.info('Updating mealChart with values:', values);
    }
    // Add logic to handle form submission, e.g., API call
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <OrganizationUnitDropdown form={form} />
      {/* <Button type="submit" mt="md">
        {initialValues ? 'Update' : 'Create'}
      </Button> */}

      {/** Only show scheduled menu's */}
      <Select
        required={false}
        label="Select Menu Type"
        key={form.key('menuType')}
        placeholder="Select your menu type"
        data={Object.values(MenuType).map((value) => ({
          value,
          label: value,
        }))}
        {...form.getInputProps('menuType')}
      />

      <Divider label="MealChart Details" labelPosition="center" my="lg" />

      <MealChartView
        unit={form.values.unit ?? ''}
        organization={form.values.organization ?? ''}
        menuType={form.values.menuType}
        mealChartType={MealChartType.Main}
      />
    </form>
  );
}
