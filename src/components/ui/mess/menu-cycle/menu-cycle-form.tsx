//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { TextInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { isEmpty } from 'lodash';

import {
  MenuCycleRequest,
  MenuCycleResponse,
} from '@/interfaces/mess/menu-cycle.interface';
import { useCreateMenuCycle } from '@/lib/api/mess/menu-cycle/create-menu-cycle';
import { useUpdateMenuCycle } from '@/lib/api/mess/menu-cycle/update-menu-cycle';

import { useNotifications } from '../../core/notifications';

interface Props {
  initialValues?: Partial<MenuCycleResponse>;
}

export function MenuCycleForm({ initialValues }: Props) {
  const form = useForm({
    initialValues,
    // validate : MenuCycleRequestZodSchema
  });
  const { addNotification } = useNotifications();

  const updateMenuCycleMutation = useUpdateMenuCycle({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'MenuCycle Updated',
        });
      },
    },
  });

  const createMenuCycleMutation = useCreateMenuCycle({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'MenuCycle Created',
        });
      },
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    if (isEmpty(initialValues)) {
      // validate the form values before proceeding

      // Handle create menuCycle logic
      createMenuCycleMutation.mutate({
        data: values as MenuCycleRequest,
      });
    } else {
      updateMenuCycleMutation.mutate({
        menuCycleId: (initialValues as MenuCycleResponse)?._id,
        data: values as Partial<MenuCycleRequest>,
      });
    }
    // Add logic to handle form submission, e.g., API call
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="MenuCycle Name"
        placeholder="Enter menuCycle name"
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
