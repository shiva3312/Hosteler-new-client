//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { TextInput, Button, Grid, Select, Box, Text } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { IconClock } from '@tabler/icons-react';
import { isEmpty } from 'lodash';

import { useScreenType } from '@/hooks/use-scree-type';
import { MessStatus, ScheduleFor } from '@/interfaces/enums';
import { MessRequest, MessResponse } from '@/interfaces/mess/mess.interface';
import { useCreateMess } from '@/lib/api/mess/mess/create-mess';
import { useUpdateMess } from '@/lib/api/mess/mess/update-mess';

import OrganizationUnitDropdown from '../../core/dropdown/organization-unit-selector';
import { GenericFieldset } from '../../core/fieldset/fieldset';
import { useNotifications } from '../../core/notifications';
import { ScheduleJobForm } from '../../schedule/schedule-form';

interface Props {
  initialValues?: Partial<MessRequest>;
}

export function MessForm({ initialValues = {} }: Props) {
  const form = useForm({
    initialValues,
    // validate : MessRequestZodSchema
  });
  const { screenType } = useScreenType();
  const { addNotification } = useNotifications();

  const updateMessMutation = useUpdateMess({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Mess Updated',
        });
      },
    },
  });

  const createMessMutation = useCreateMess({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Mess Created',
        });
      },
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    if (isEmpty(initialValues)) {
      // Handle create mess logic
      createMessMutation.mutate({
        data: values as MessRequest,
      });
    } else {
      updateMessMutation.mutate({
        messId: (initialValues as MessResponse)?._id,
        data: values,
      });
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <GenericFieldset legend={'Basic Info'} radius="md" p="md">
        <TextInput
          label="Mess Name"
          placeholder="Enter mess name"
          {...form.getInputProps('name')}
          required
        />
        <TextInput
          label="Description"
          placeholder="Enter description"
          {...form.getInputProps('description')}
        />

        <Select
          required={false}
          label="Mess Status"
          key={form.key('status')}
          placeholder="Select mess status"
          data={Object.values(MessStatus).map((status) => ({
            label: status,
            value: status,
          }))}
          value={form.values.status}
          {...form.getInputProps('status')}
        />

        <TextInput
          label="Extra Meal Count"
          placeholder="Enter Extra Meal Count"
          {...form.getInputProps('extraMealCount')}
        />

        <OrganizationUnitDropdown form={form} />
      </GenericFieldset>

      <GenericFieldset legend={'Meal Times'} radius="md" p="md" mt={'md'}>
        {(
          ['breakFastTime', 'lunchTime', 'dinnerTime', 'snackTime'] as const
        ).map((meal) => {
          const label =
            meal === 'breakFastTime'
              ? 'Breakfast'
              : meal === 'lunchTime'
                ? 'Lunch'
                : meal === 'dinnerTime'
                  ? 'Dinner'
                  : 'Snack';
          // const chartKey =
          //   meal === 'breakFastTime'
          //     ? 'breakFastChartTime'
          //     : meal === 'lunchTime'
          //       ? 'lunchChartTime'
          //       : meal === 'dinnerTime'
          //         ? 'dinnerChartTime'
          //         : 'snackChartTime';

          return (
            <Box key={meal} mb="md">
              <Grid align="center" justify="space-between">
                <Grid.Col span={4}>
                  <TimeInput
                    label={`${label} Start Time`}
                    value={form.values?.[meal]?.startTime}
                    {...form.getInputProps(`${meal}.startTime`)}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TimeInput
                    label={`${label} End Time`}
                    value={form.values?.[meal]?.endTime}
                    {...form.getInputProps(`${meal}.endTime`)}
                  />
                </Grid.Col>
                {/* <Grid.Col span={3}>
                  <TimeInput
                    label={`${label} Chart Time`}
                    value={form.values?.[chartKey]}
                    placeholder="Select chart time"
                    {...form.getInputProps(chartKey)}
                  />
                </Grid.Col> */}
                {/* <Grid.Col span={3} pt={'xl'}>
                  <Switch
                    label="Is Active"
                    checked={form.values?.[meal]?.isActive}
                    onChange={(event) => {
                      form.setFieldValue(
                        `${meal}.isActive`,
                        event.currentTarget.checked,
                      );
                    }}
                  />
                </Grid.Col> */}
                <Grid.Col span={4}>
                  <Text size="xs">{`${label} Chart Time`}</Text>
                  <Button
                    leftSection={<IconClock size={'16'} />}
                    onClick={() => {
                      modals.open({
                        title: `Edit ${label} Time`,
                        children: (
                          <ScheduleJobForm
                            name={`Schedule ${label} chart time`}
                            unit={form.values?.unit ?? ''}
                            organization={form.values?.organization ?? ''}
                            scheduleFor={`${label} Chart` as ScheduleFor}
                          />
                        ),
                        size: 'lg',
                        fullScreen: screenType === 'small',
                      });
                    }}
                  >
                    {`Schedule Chart`}
                  </Button>
                </Grid.Col>
              </Grid>
            </Box>
          );
        })}
      </GenericFieldset>

      <Button type="submit" mt="md">
        {initialValues ? 'Update' : 'Create'}
      </Button>
    </form>
  );
}
