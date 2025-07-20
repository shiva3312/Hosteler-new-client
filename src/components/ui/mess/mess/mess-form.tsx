//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { TextInput, Button, Grid, Select, Box } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { IconClock } from '@tabler/icons-react';
import { isEmpty } from 'lodash';

import logger from '@/config/log';
import { UserRole } from '@/data/feature';
import { useScreenType } from '@/hooks/use-scree-type';
import { MessStatus, ScheduleFor } from '@/interfaces/enums';
import { MessRequest, MessResponse } from '@/interfaces/mess/mess.interface';
import { useCreateMess } from '@/lib/api/mess/mess/create-mess';
import { useUpdateMess } from '@/lib/api/mess/mess/update-mess';
import { useOrganizations } from '@/lib/api/organization/get-all-organizations';
import { SearchQuery } from '@/lib/api/search-query';
import { useUnits } from '@/lib/api/unit/get-all-units';
import { useMe } from '@/lib/api/user/get-me';

import { AsyncAutocompleteCombobox } from '../../core/dropdown';
import { GenericFieldset } from '../../core/fieldset/fieldset';
import { useNotifications } from '../../core/notifications';
import { ScheduleJobForm } from '../../schedule/schedule-form';
import OrganizationUnitDropdown from '../../core/dropdown/organization-unit-selector';

interface Props {
  initialValues?: Partial<MessRequest>;
}

export function MessForm({ initialValues = {} }: Props) {
  const form = useForm({
    initialValues,
    // validate : MessRequestZodSchema
  });
  const { screenType } = useScreenType();
  const { data: me } = useMe();
  const { data: organizations, isLoading: orgLoading } = useOrganizations({});
  const { data: units, isLoading: unitLoading } = useUnits({
    params: SearchQuery?.unitSearchQuery({
      organization: [form.values.organization!],
    }),
    enabled: !!form.values.organization,
  });

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
      logger.info('Creating mess with values:', values);
    } else {
      updateMessMutation.mutate({
        messId: (initialValues as MessResponse)?._id,
        data: values,
      });

      logger.info('Updating mess with values:', values);
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
                <Grid.Col span={4} pt={'xl'}>
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
                    Schedule
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
