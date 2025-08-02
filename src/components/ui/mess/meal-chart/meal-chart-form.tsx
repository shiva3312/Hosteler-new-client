//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Center, Divider, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { isEmpty } from 'lodash';

import { LoaderWrapper } from '@/components/layouts/loader-wrapper';
import logger from '@/config/log';
import { MealChartType, MenuType } from '@/interfaces/enums';
import {
  MealChartRequest,
  MealChartResponse,
} from '@/interfaces/mess/meal-chart.interface';
import { useCreateMealChart } from '@/lib/api/mess/meal-chart/create-meal-chart';
import { useMealChartsToView } from '@/lib/api/mess/meal-chart/create-to-view-meal-chart';
import { useUpdateMealChart } from '@/lib/api/mess/meal-chart/update-meal-chart';

import MealChartDetails from './meal-chart-view';
import MenuTypeDropdown from '../../core/dropdown/menu-type';
import OrganizationUnitDropdown from '../../core/dropdown/organization-unit-selector';
import { useNotifications } from '../../core/notifications';

interface Props {
  initialValues?: Partial<MealChartResponse>;
  viewOnly?: boolean;
}
export function MealChartForm({ initialValues, viewOnly }: Props) {
  const form = useForm({
    initialValues: { ...initialValues },
    // validate : MealChartRequestZodSchema
  });
  const { addNotification } = useNotifications();

  const { data: mealChart, isLoading } = useMealChartsToView({
    params: {
      unit: form.values.unit ?? '',
      organization: form.values.organization ?? '',
      menuType: form.values.menuType ?? MenuType.Dinner,
      mealChartType: initialValues?.type ?? MealChartType.Main,
    },
    enabled:
      !!form.values.unit && !!form.values.organization && !form.values._id,
  });

  const targetMealChart = initialValues?._id ? initialValues : mealChart?.data;

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
        id: (initialValues as MealChartResponse)?._id,
        data: values as Partial<MealChartRequest>,
      });

      logger.info('Updating mealChart with values:', values);
    }
    // Add logic to handle form submission, e.g., API call
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      {viewOnly && (
        <>
          <OrganizationUnitDropdown form={form} />

          {/** Only show scheduled menu's */}
          <MenuTypeDropdown form={form} />

          <Divider label="MealChart Details" labelPosition="center" my="lg" />
        </>
      )}
      {form.values.menuType ? (
        <LoaderWrapper
          isLoading={isLoading}
          loadingText="Hold a minute, Getting you meal chart..."
        >
          <MealChartDetails
            mealChart={targetMealChart as MealChartResponse}
            viewOnly={viewOnly}
          />
        </LoaderWrapper>
      ) : (
        <Center h="100%" p="xl">
          <Text c="red" size="sm">
            No schedules available for the selected menu type. Please create a
            schedule first.
          </Text>
        </Center>
      )}
    </form>
  );
}
