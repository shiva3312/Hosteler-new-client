//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { TextInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { isEmpty } from 'lodash';

import { UserRole } from '@/data/feature';
import {
  OrganizationRequest,
  OrganizationResponse,
} from '@/interfaces/organization.interface';
import { useCreateOrganization } from '@/lib/api/organization/create-organization';
import { useUpdateOrganization } from '@/lib/api/organization/update-organization';
import { SearchQuery } from '@/lib/api/search-query';
import { useUsers } from '@/lib/api/user/get-users';

import { AsyncAutocompleteCombobox } from '../core/dropdown';
import { useNotifications } from '../core/notifications';

interface Props {
  initialValues?: Partial<OrganizationRequest>;
}

export function OrganizationForm({ initialValues }: Props) {
  const form = useForm({
    initialValues,
    // validate : OrganizationRequestZodSchema
  });
  const { addNotification } = useNotifications();

  const { data: users, isLoading } = useUsers({
    params: SearchQuery.hasAllRoles([UserRole.SUPER_ADMIN]),
    enabled: !!form.values.name,
  });

  const updateOrganizationMutation = useUpdateOrganization({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Organization Updated',
        });
      },
    },
  });

  const createOrganizationMutation = useCreateOrganization({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Organization Created',
        });
      },
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    if (isEmpty(initialValues)) {
      // Handle create organization logic
      createOrganizationMutation.mutate({
        data: values as OrganizationRequest,
      });
      console.log('Creating organization with values:', values);
    } else {
      updateOrganizationMutation.mutate({
        organizationId: (initialValues as OrganizationResponse)?._id,
        data: values,
      });

      console.log('Updating organization with values:', values);
    }
    // Add logic to handle form submission, e.g., API call
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="Organization Name"
        placeholder="Enter organization name"
        {...form.getInputProps('name')}
        required
      />
      <TextInput
        label="Description"
        placeholder="Enter description"
        {...form.getInputProps('description')}
        required
      />
      <AsyncAutocompleteCombobox
        label="Super Admin"
        placeholder="Select super admin"
        data={
          users?.data?.map((user) => ({
            label: user.username,
            value: user._id,
          })) || []
        }
        selected={form.values.superAdmin ?? ''}
        onChange={(value) => form.setFieldValue('superAdmin', value)}
        loading={isLoading}
      />
      <Button type="submit" mt="md">
        {initialValues ? 'Update' : 'Create'}
      </Button>
    </form>
  );
}
