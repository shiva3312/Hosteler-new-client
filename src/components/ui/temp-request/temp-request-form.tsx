//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { TextInput, Button, Textarea, Select } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { isEmpty } from 'lodash';
import { useMemo } from 'react';

import logger from '@/config/log';
import { UserRole } from '@/data/feature';
import { TempRequestType } from '@/interfaces/enums';
import {
  TempRequestRequest,
  TempRequestResponse,
} from '@/interfaces/temp-request.interface';
import { AuthorizationService } from '@/lib/api/auth/authorization';
import { useCreateTempRequest } from '@/lib/api/temp-request/create-temp-request';
import { useUpdateTempRequest } from '@/lib/api/temp-request/update-temp-request';
import { useMe } from '@/lib/api/user/get-me';

import OrganizationUnitDropdown from '../core/dropdown/organization-unit-selector';
import { useNotifications } from '../core/notifications';

interface Props {
  initialValues?: Partial<TempRequestRequest>;
}

export function TempRequestForm({ initialValues }: Props) {
  const form = useForm({
    initialValues,
    // validate : TempRequestRequestZodSchema
  });

  const { addNotification } = useNotifications();

  const updateTempRequestMutation = useUpdateTempRequest({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'TempRequest Updated',
        });
      },
    },
  });

  const createTempRequestMutation = useCreateTempRequest({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'TempRequest Created',
        });
      },
    },
  });
  const { data: me } = useMe();

  const tempRequestTypes = useMemo(
    () =>
      Object.values(TempRequestType)
        .map((type) => ({
          value: type,
          label: type,
        }))
        .filter((type) => {
          if (
            AuthorizationService.getHightest(me?.data.roles ?? []) ===
            UserRole.MASTER_ADMIN
          ) {
            return true;
          }
          if (
            AuthorizationService.hasEqualOrHigherRole(
              me?.data.roles ?? [],
              UserRole.ADMIN,
            ) &&
            type.value === TempRequestType.RegisterUserFormLink
          ) {
            return true;
          }
          return false;
        }),
    [me?.data?.roles],
  );

  console.log('TempRequest Types:', tempRequestTypes);

  const handleSubmit = (values: typeof form.values) => {
    if (isEmpty(initialValues)) {
      // Handle create tempRequest logic
      createTempRequestMutation.mutate({
        data: values as TempRequestRequest,
      });
      logger.info('Creating tempRequest with values:', values);
    } else {
      updateTempRequestMutation.mutate({
        tempRequestId: (initialValues as TempRequestResponse)?._id,
        data: values,
      });

      logger.info('Updating tempRequest with values:', values);
    }
    // Add logic to handle form submission, e.g., API call
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <OrganizationUnitDropdown form={form} />

      <TextInput
        label="Name"
        placeholder="Enter hostel name"
        {...form.getInputProps('name')}
        required
      />
      <Textarea
        label="Description"
        placeholder="Enter description"
        {...form.getInputProps('description')}
      />

      <Select
        label="Type"
        placeholder="Select Type"
        data={tempRequestTypes}
        {...form.getInputProps('type')}
      />

      <DatePickerInput
        label="Pick date"
        placeholder="Pick date"
        minDate={new Date()}
        value={form.values.expiresAt ? new Date(form.values.expiresAt) : null}
        onChange={(date) => {
          if (date instanceof Date) {
            form.setFieldValue('expiresAt', date.toISOString());
          } else {
            form.setFieldValue('expiresAt', null);
          }
        }}
      />

      <Button type="submit" mt="md" size="xs">
        {initialValues ? 'Update' : 'Create'}
      </Button>
    </form>
  );
}
