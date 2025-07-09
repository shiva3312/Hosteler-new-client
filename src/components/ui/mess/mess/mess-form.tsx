//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { TextInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { isEmpty } from 'lodash';

import { MessRequest, MessResponse } from '@/interfaces/mess/mess.interface';
import { useCreateMess } from '@/lib/api/mess/mess/create-mess';
import { useUpdateMess } from '@/lib/api/mess/mess/update-mess';

import { useNotifications } from '../../core/notifications';

interface Props {
  initialValues?: Partial<MessRequest>;
}

export function MessForm({ initialValues }: Props) {
  const form = useForm({
    initialValues,
    // validate : MessRequestZodSchema
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
      console.log('Creating mess with values:', values);
    } else {
      updateMessMutation.mutate({
        messId: (initialValues as MessResponse)?._id,
        data: values,
      });

      console.log('Updating mess with values:', values);
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
      <Button type="submit" mt="md">
        {initialValues ? 'Update' : 'Create'}
      </Button>
    </form>
  );
}
