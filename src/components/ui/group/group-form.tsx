//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { TextInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { isEmpty } from 'lodash';

import logger from '@/config/log';
import { GroupRequest, GroupResponse } from '@/interfaces/group.interface';
import { useCreateGroup } from '@/lib/api/group/create-group';
import { useUpdateGroup } from '@/lib/api/group/update-group';
import { useOrganizations } from '@/lib/api/organization/get-all-organizations';
import { SearchQuery } from '@/lib/api/search-query';
import { useUnits } from '@/lib/api/unit/get-all-units';

import { AsyncAutocompleteCombobox } from '../core/dropdown';
import { useNotifications } from '../core/notifications';

interface Props {
  initialValues?: Partial<GroupRequest>;
}

export function GroupForm({ initialValues }: Props) {
  const form = useForm({
    initialValues,
    // validate : GroupRequestZodSchema
  });
  const { addNotification } = useNotifications();

  const { data: organizations, isLoading: orgLoading } = useOrganizations({});
  const { data: units, isLoading: unitLoading } = useUnits({
    params: SearchQuery.unitSearchQuery({
      organization: [form.values.organization!],
    }),
    enabled: !!form.values.organization,
  });

  const updateGroupMutation = useUpdateGroup({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Group Updated',
        });
      },
    },
  });

  const createGroupMutation = useCreateGroup({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Group Created',
        });
      },
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    if (isEmpty(initialValues)) {
      // Handle create group logic
      createGroupMutation.mutate({
        data: values as GroupRequest,
      });
      logger.info('Creating group with values:', values);
    } else {
      updateGroupMutation.mutate({
        groupId: (initialValues as GroupResponse)?._id,
        data: values,
      });

      logger.info('Updating group with values:', values);
    }
    // Add logic to handle form submission, e.g., API call
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="Group Name"
        placeholder="Enter group name"
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
        label="Organization"
        placeholder="Select organization"
        data={
          organizations?.data?.map((user) => ({
            label: user.name,
            value: user._id,
          })) || []
        }
        selected={form.values.organization ?? ''}
        onChange={(value) => form.setFieldValue('organization', value)}
        loading={orgLoading}
      />

      <AsyncAutocompleteCombobox
        label="Unit"
        placeholder="Select Unit"
        data={
          units?.data?.map((user) => ({
            label: user.name,
            value: user._id,
          })) || []
        }
        selected={form.values.unit ?? ''}
        onChange={(value) => form.setFieldValue('unit', value)}
        loading={unitLoading}
      />

      <Button type="submit" mt="md">
        {initialValues ? 'Update' : 'Create'}
      </Button>
    </form>
  );
}
