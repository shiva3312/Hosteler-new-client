//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { TextInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { isEmpty } from 'lodash';

import { MenuRequest, MenuResponse } from '@/interfaces/mess/menu.interface';
import { useCreateMenu } from '@/lib/api/mess/menu/create-menu';
import { useUpdateMenu } from '@/lib/api/mess/menu/update-menu';

import { useNotifications } from '../../core/notifications';

interface Props {
  initialValues?: Partial<MenuResponse>;
}

export function MenuForm({ initialValues }: Props) {
  const form = useForm({
    initialValues,
    // validate : MenuRequestZodSchema
  });
  const { addNotification } = useNotifications();

  const updateMenuMutation = useUpdateMenu({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Menu Updated',
        });
      },
    },
  });

  const createMenuMutation = useCreateMenu({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Menu Created',
        });
      },
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    if (isEmpty(initialValues)) {
      // Handle create menu logic
      createMenuMutation.mutate({
        data: values as MenuRequest,
      });
    } else {
      updateMenuMutation.mutate({
        menuId: (initialValues as MenuResponse)?._id,
        data: values as MenuRequest,
      });
    }
    // Add logic to handle form submission, e.g., API call
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="Menu Name"
        placeholder="Enter menu name"
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
