//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { TextInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { isEmpty } from 'lodash';

import logger from '@/config/log';
import { MessRequest, MessResponse } from '@/interfaces/mess/mess.interface';
import { useCreateMess } from '@/lib/api/mess/mess/create-mess';
import { useUpdateMess } from '@/lib/api/mess/mess/update-mess';
import { useOrganizations } from '@/lib/api/organization/get-all-organizations';
import { SearchQuery } from '@/lib/api/search-query';
import { useUnits } from '@/lib/api/unit/get-all-units';

import { AsyncAutocompleteCombobox } from '../../core/dropdown';
import { useNotifications } from '../../core/notifications';

interface Props {
  initialValues?: Partial<MessRequest>;
}

export function MessForm({ initialValues }: Props) {
  const form = useForm({
    initialValues,
    // validate : MessRequestZodSchema
  });
  const { data: organizations, isLoading: orgLoading } = useOrganizations({});
  const { data: units, isLoading: unitLoading } = useUnits({
    params: SearchQuery.unitSearchQuery({
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
    // Add logic to handle form submission, e.g., API call
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
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
        onChange={(value) => {
          form.setFieldValue('organization', value);
          form.setFieldValue('admin', '');
        }}
        loading={orgLoading}
      />

      <AsyncAutocompleteCombobox
        label="Unit"
        placeholder="Select Unit"
        data={
          units?.data?.map((unit) => ({
            label: unit.name,
            value: unit._id,
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
