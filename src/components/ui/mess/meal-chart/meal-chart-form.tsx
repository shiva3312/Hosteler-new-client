//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Card, Center, Divider, Select, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { isEmpty } from 'lodash';
import { useMemo } from 'react';

import logger from '@/config/log';
import { MealChartType, MenuType, ScheduleFor } from '@/interfaces/enums';
import {
  MealChartRequest,
  MealChartResponse,
} from '@/interfaces/mess/meal-chart.interface';
import { useCreateMealChart } from '@/lib/api/mess/meal-chart/create-meal-chart';
import { useUpdateMealChart } from '@/lib/api/mess/meal-chart/update-meal-chart';
import { useSchedules } from '@/lib/api/schedule/get-all-schedules';

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
  const { data: schedules } = useSchedules({
    queryConfig: {
      enabled: !!form.values.unit && !!form.values.organization,
    },
  });

  // remove option from menuTypeOptions according to schedules
  const filteredMenuTypeOptions = useMemo(() => {
    const menuTypeOptions: MenuType[] = [];
    if (schedules?.data) {
      schedules.data
        .filter(
          (s) =>
            s.unit === form.values.unit &&
            s.organization === form.values.organization,
        )
        .forEach((schedule) => {
          if (schedule.scheduleFor === ScheduleFor.MEAL_BREAKFAST_CHART) {
            menuTypeOptions.push(MenuType.Breakfast);
          } else if (schedule.scheduleFor === ScheduleFor.MEAL_LUNCH_CHART) {
            menuTypeOptions.push(MenuType.Lunch);
          } else if (schedule.scheduleFor === ScheduleFor.MEAL_DINNER_CHART) {
            menuTypeOptions.push(MenuType.Dinner);
          } else if (schedule.scheduleFor === ScheduleFor.MEAL_SNACK_CHART) {
            menuTypeOptions.push(MenuType.Snack);
          }
        });
    }

    return Object.values(MenuType)
      .map((value) => ({
        value,
        label: value,
      }))
      .filter((option) => menuTypeOptions.includes(option.value));
  }, [form.values.organization, form.values.unit, schedules?.data]);

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
        placeholder={'Select your menu type'}
        nothingFoundMessage={
          Object.keys(filteredMenuTypeOptions).length > 0
            ? 'Select your menu type'
            : 'No menu types available'
        }
        data={filteredMenuTypeOptions}
        {...form.getInputProps('menuType')}
      />

      <Divider label="MealChart Details" labelPosition="center" my="lg" />

      {Object.keys(filteredMenuTypeOptions).length > 0 ? (
        <MealChartView
          unit={form.values.unit ?? ''}
          organization={form.values.organization ?? ''}
          menuType={form.values.menuType}
          mealChartType={MealChartType.Main}
        />
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
