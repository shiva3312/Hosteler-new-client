//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.

import { Select, SelectProps } from '@mantine/core';
import { useMemo } from 'react';

import { LoaderWrapper } from '@/components/layouts/loader-wrapper';
import { MenuType, ScheduleFor } from '@/interfaces/enums';
import { useSchedules } from '@/lib/api/schedule/get-all-schedules';

interface Props extends SelectProps {
  /**
   * Form instance to manage form state.
   * If provided, the component will use mantine form props & need not to pass other props.
   * If not provided, it will use normal props.
   * This is useful for integrating with mantine forms.
   * If you want to use this component without mantine form, pass `undefined` or `null` here.
   * @default undefined
   * @example
   * <MenuTypeUnitDropdown
   *   onMenuTypeChange={handleMenuTypeChange}
   *   selectedMenuType={selectedOrg}
   * />
   * @example
   * <MenuTypeUnitDropdown
   *   form={form} // mantine form instance
   * />
   * @note If you are using this component with mantine form, No need to pass any other props
   */
  form?: any; // mantine form instance or Mantine form instance

  /**
   * Callbacks to handle menuType and unit changes.
   * If you are using this component with mantine form, No need to pass these props.
   *
   * @note If you are not using mantine form, you must provide these callbacks.
   */
  onMenuTypeChange?: (value: string | null) => void;
  selectedMenuType?: string | null;
  unit?: string;
  organization?: string;
}

const MenuTypeDropdown = ({
  unit,
  organization,
  onMenuTypeChange,
  selectedMenuType,
  form, // mantine form instance or Mantine form instance
  ...props
}: Props) => {
  const { data: schedules, isLoading } = useSchedules({
    params: {
      unit: form?.values.unit ?? unit,
      organization: form?.values.organization ?? organization,
    },
    queryConfig: {
      enabled:
        !!(form.values.unit ?? unit) &&
        !!(form.values.organization ?? organization),
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

  return (
    <LoaderWrapper isLoading={isLoading} loadingText="Loading menuTypes ...">
      <Select
        required={false}
        label="Select Menu Type"
        key={form.key('menuType')}
        placeholder={'Select your menu type'}
        data={filteredMenuTypeOptions}
        nothingFoundMessage={
          Object.keys(filteredMenuTypeOptions).length > 0
            ? 'Select your menu type'
            : 'No menu types available'
        }
        {...(form
          ? {
              selected: form.values?.menuType ?? '',
              onChange: (value) => form.setFieldValue('menuType', value),
            }
          : {
              selected: selectedMenuType ?? '',
              onChange: (value) => onMenuTypeChange?.(value),
            })}
        {...props}
      />
    </LoaderWrapper>
  );
};

export default MenuTypeDropdown;
