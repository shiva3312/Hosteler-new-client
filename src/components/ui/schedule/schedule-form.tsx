//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import {
  Button,
  Group,
  MultiSelect,
  Select,
  Stack,
  TextInput,
  Title,
  Divider,
  Paper,
  Checkbox,
} from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';

import { LoaderWrapper } from '@/components/layouts/loader-wrapper';
import logger from '@/config/log';
import { ScheduleFor, ScheduleType } from '@/interfaces/enums';
import {
  ScheduleRequest,
  ScheduleRequestZodSchema,
  ScheduleResponse,
} from '@/interfaces/schedule.interface';
import { useCreateSchedule } from '@/lib/api/schedule/create-schedule';
import { useSchedules } from '@/lib/api/schedule/get-all-schedules';
import { useUpdateSchedule } from '@/lib/api/schedule/update-schedule';
import { SearchQuery } from '@/lib/api/search-query';

import { useNotifications } from '../core/notifications';

interface ScheduleJobFormProps {
  name?: string;
  description?: string;
  unit: string;
  organization: string;
  scheduleFor: ScheduleFor;
}

// Helper to make friendly labels, e.g. "Asia/Kolkata (UTC+05:30)"
const timezoneOptions = moment.tz.names().map((tz) => {
  const offset = moment.tz(tz).format('Z'); // e.g. "+05:30"
  const label = `(UTC${offset}) - ${tz.replace('_', ' ')} `;
  return {
    value: tz,
    label,
  };
});
export function ScheduleJobForm(props: ScheduleJobFormProps) {
  const { addNotification } = useNotifications();

  const form = useForm({
    validate: zodResolver(ScheduleRequestZodSchema),
    initialValues: {
      name: props.name || '',
      description: props.description || '',
      startTime: new Date(),
      scheduleFor: props.scheduleFor ?? ScheduleFor.MEAL_BREAKFAST_CHART,
      unit: props.unit || '',
      organization: props.organization || '',
      type: ScheduleType.Daily, // Add the 'type' property to initialValues
      time: '',
      timezone: moment.tz.guess(),
      isActive: true,
    },
  });

  const { data: schedules, isLoading } = useSchedules({
    params: SearchQuery?.scheduleSearchQuery({}),
  });

  useEffect(() => {
    if (schedules && schedules.data.length > 0) {
      const schedule = schedules.data.find(
        (s) => s.scheduleFor === form.values.scheduleFor,
      );
      if (!schedule) return;
      form.setValues({
        ...form.values,
        ...schedule,
        type: schedule.type,
      });

      form.resetDirty();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedules]);

  const updateScheduleMutation = useUpdateSchedule({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Schedule Updated',
        });
      },
    },
  });

  const createScheduleMutation = useCreateSchedule({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Schedule Created',
        });
      },
    },
  });

  const [showCronInput, setShowCronInput] = useState(false);

  const onSubmit = (values: Partial<ScheduleRequest | ScheduleResponse>) => {
    // console.log('Form submitted with values:', values);
    // Handle form submission logic here
    if (!(values as ScheduleResponse)._id) {
      // Create new schedule
      createScheduleMutation.mutate({
        data: values as ScheduleRequest,
      });
      logger.info('Creating schedule with values:', values);
    } else {
      // Update existing schedule
      updateScheduleMutation.mutate({
        scheduleId: (values as ScheduleResponse)._id,
        data: values as ScheduleRequest,
      });
      logger.info('Updating schedule with values:', values);
    }
  };

  const recurrenceOptions: { label: string; value: string }[] = [
    { label: 'Every Day', value: 'daily' },
    { label: 'Every Week', value: 'weekly' },
    { label: 'Every Month', value: 'monthly' },
    { label: 'Custom (use Cron)', value: 'custom' },
  ];

  const handleRecurrenceChange = (value: string | null) => {
    setShowCronInput(value === 'custom');
    if (value !== 'custom') {
      form.setFieldValue('cronTime', '');
    }
    switch (value) {
      case 'daily':
        form.setFieldValue('type', ScheduleType.Daily);
        break;
      case 'weekly':
        form.setFieldValue('type', ScheduleType.Weekly);
        break;
      case 'monthly':
        form.setFieldValue('type', ScheduleType.Monthly);
        break;
      case 'yearly':
        form.setFieldValue('type', ScheduleType.Yearly);
        break;
      case 'custom':
        form.setFieldValue('type', ScheduleType.Custom);
        break;
      default:
        form.setFieldValue('type', ScheduleType.Daily);
        setShowCronInput(false);
        break;
    }
  };

  return (
    <LoaderWrapper isLoading={isLoading}>
      <Paper shadow="md" p="lg" radius="md" withBorder>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack gap={'md'}>
            <Title order={3}>Schedule a Job</Title>

            {/* General Information Section */}
            {/* <Divider label="General Information" labelPosition="center" />
          <Stack>
            <TextInput
              label="Name"
              placeholder="Enter job name"
              withAsterisk
              {...form.getInputProps('name')}
            />
            <TextInput
              label="Description"
              placeholder="Enter job description"
              {...form.getInputProps('description')}
            />
          </Stack> */}

            {/* Schedule Timing Section */}
            {/* <Divider label="Schedule Timing" labelPosition="center" /> */}
            <Group grow>
              {/* <DateInput
                label="Start Date"
                placeholder="Select start date"
                withAsterisk
                {...form.getInputProps('startTime')}
              />
              <DateInput
                label="End Date"
                placeholder="Select end date"
                withAsterisk
                {...form.getInputProps('endTime')}
              /> */}
              <TimeInput
                description="Select the time of day for the schedule"
                label="Time of Day"
                placeholder="Select time"
                {...form.getInputProps('time')}
              />
            </Group>

            {/* Recurrence Section */}
            {/* <Divider label="Recurrence" labelPosition="center" /> */}
            <Stack>
              <Select
                label="Recurrence"
                description="Select how often this schedule should recur"
                placeholder="Select recurrence type"
                data={recurrenceOptions}
                defaultValue="daily"
                key={form.key('type')}
                {...form.getInputProps('type')}
                onChange={handleRecurrenceChange}
              />

              {form.values.type === ScheduleType.Weekly && !showCronInput && (
                <MultiSelect
                  description="Select days of the week"
                  label="Days of the Week"
                  key={form.key('dayOfWeeks')}
                  placeholder="Select days"
                  data={[
                    { label: 'Sunday', value: '0' },
                    { label: 'Monday', value: '1' },
                    { label: 'Tuesday', value: '2' },
                    { label: 'Wednesday', value: '3' },
                    { label: 'Thursday', value: '4' },
                    { label: 'Friday', value: '5' },
                    { label: 'Saturday', value: '6' },
                  ]}
                  onChange={(value) => {
                    form.setFieldValue('dayOfWeeks', value);
                  }}
                  value={(
                    (form?.values as unknown as ScheduleRequest)?.dayOfWeeks ??
                    []
                  ).map(String)}
                />
              )}

              {form.values.type === ScheduleType.Monthly && !showCronInput && (
                <MultiSelect
                  label="Days of the Month"
                  key={form.key('daysOfMonth')}
                  description="Select days of the month (1-31)"
                  placeholder="Select days"
                  data={Array.from({ length: 31 }, (_, i) => `${i + 1}`)}
                  value={(
                    (form?.values as unknown as ScheduleRequest)?.daysOfMonth ??
                    []
                  ).map(String)}
                  onChange={(value) => {
                    form.setFieldValue('daysOfMonth', value);
                  }}
                />
              )}

              {/* {form.values.type === ScheduleType.Yearly && (
                <Group grow>
                  <MultiSelect
                    label="Months of the Year"
                    placeholder="Select months"
                    data={[...Array(12)].map((_, i) => `${i + 1}`)}
                    {...form.getInputProps('monthsOfYear')}
                  />
                  <MultiSelect
                    label="Years"
                    placeholder="Select years"
                    data={[...Array(50)].map(
                      (_, i) => `${new Date().getFullYear() + i}`,
                    )}
                    {...form.getInputProps('years')}
                  />
                </Group>
              )} */}

              {showCronInput && (
                <TextInput
                  label="Cron Expression"
                  description="Enter a valid cron expression for custom scheduling"
                  placeholder="* * * * *"
                  {...form.getInputProps('cronTime')}
                />
              )}

              <Select
                label="Select Timezone"
                description="Timezone determines when the schedule runs based on local time"
                withAsterisk
                required
                data={timezoneOptions}
                key={form.key('timezone')}
                {...form.getInputProps('timezone')}
              />
            </Stack>

            {/* Additional Settings Section */}
            {/* <Divider label="Additional Settings" labelPosition="center" /> */}
            <Stack>
              <Checkbox
                label="Active"
                description="Enable or disable this schedule"
                {...form.getInputProps('isActive', { type: 'checkbox' })}
              />
              {/* <Select
                label="Schedule For"
                placeholder="Select purpose"
                data={Object.values(scheduleFor).map((v) => ({
                  label: v,
                  value: v,
                }))}
                withAsterisk
                {...form.getInputProps('scheduleFor')}
              />
              <Select
                label="Status"
                placeholder="Select status"
                data={Object.values(ScheduleStatus).map((v) => ({
                  label: v,
                  value: v,
                }))}
                {...form.getInputProps('status')}
              /> */}
            </Stack>

            {/* Reference Fields Section */}
            {/* <Divider label="Reference Fields" labelPosition="center" />
          <Stack>
            <TextInput
              label="Unit ID"
              placeholder="Enter unit ID"
              {...form.getInputProps('unit')}
            />
            <TextInput
              label="Organization ID"
              placeholder="Enter organization ID"
              {...form.getInputProps('organization')}
            />
          </Stack> */}

            <Divider />
            <Button
              type="submit"
              fullWidth
              disabled={!form.isDirty()}
              loading={
                updateScheduleMutation.isPending ||
                createScheduleMutation.isPending
              }
            >
              {schedules && schedules?.data.length > 0
                ? 'Update Schedule'
                : 'Create Schedule'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </LoaderWrapper>
  );
}
