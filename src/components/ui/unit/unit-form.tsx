//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { TextInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { isEmpty } from 'lodash';

import { UserRole } from '@/data/feature';
import { UnitRequest, UnitResponse } from '@/interfaces/unit.interface';
import { useOrganizations } from '@/lib/api/organization/get-all-organizations';
import { SearchQuery } from '@/lib/api/search-query';
import { useCreateUnit } from '@/lib/api/unit/create-unit';
import { useUpdateUnit } from '@/lib/api/unit/update-unit';
import { useUsers } from '@/lib/api/user/get-users';

import { AsyncAutocompleteCombobox } from '../core/dropdown';
import { useNotifications } from '../core/notifications';

interface Props {
  initialValues?: Partial<UnitRequest>;
}

export function UnitForm({ initialValues }: Props) {
  const form = useForm({
    initialValues,
    // validate : UnitRequestZodSchema
  });
  const { addNotification } = useNotifications();

  const { data: users, isLoading } = useUsers({
    params: SearchQuery.userSearchQuery({}),
    enabled: !!form.values.organization,
  });

  const { data: organizations, isLoading: orgLoading } = useOrganizations();

  const updateUnitMutation = useUpdateUnit({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Unit Updated',
        });
      },
    },
  });

  const createUnitMutation = useCreateUnit({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Unit Created',
        });
      },
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    if (isEmpty(initialValues)) {
      // Handle create unit logic
      createUnitMutation.mutate({
        data: values as UnitRequest,
      });
    } else {
      updateUnitMutation.mutate({
        unitId: (initialValues as UnitResponse)?._id,
        data: values,
      });
    }
    // Add logic to handle form submission, e.g., API call
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="Hostel Name"
        placeholder="Enter hostel name"
        {...form.getInputProps('name')}
        required
      />
      <TextInput
        label="Description"
        placeholder="Enter description"
        {...form.getInputProps('description')}
      />

      <AsyncAutocompleteCombobox
        label="Organization"
        placeholder="Select organization"
        data={
          organizations?.data?.map((user) => ({
            label: user.name,
            value: user._id,
          })) || []
        }
        selected={form.values.organization ?? ''}
        onChange={(value) => {
          form.setFieldValue('organization', value);
          form.setFieldValue('admin', '');
        }}
        loading={orgLoading}
      />

      <AsyncAutocompleteCombobox
        label="Admin"
        placeholder="Select Admin"
        data={
          users?.data
            ?.filter((u) => u.roles.includes(UserRole.ADMIN))
            .map((user) => ({
              label: user.username,
              value: user._id,
            })) || []
        }
        selected={form.values.admin ?? ''}
        onChange={(value) => form.setFieldValue('admin', value)}
        loading={isLoading}
      />

      <Button type="submit" mt="md">
        {initialValues ? 'Update' : 'Create'}
      </Button>
    </form>
  );
}
