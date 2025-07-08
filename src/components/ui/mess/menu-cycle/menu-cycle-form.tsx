//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { TextInput, Button, Drawer, UnstyledButton } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit } from '@tabler/icons-react';
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

function MenuCycleForm({ initialValues }: Props) {
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
      console.log('Creating menuCycle with values:', values);
    } else {
      updateMenuCycleMutation.mutate({
        menuCycleId: (initialValues as MenuCycleResponse)?._id,
        data: values as Partial<MenuCycleRequest>,
      });

      console.log('Updating menuCycle with values:', values);
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

// ----------------------
// Drawer wrapper component
// ----------------------

function MenuCycleFormDrawer({ initialValues }: Props) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer
        size="xl"
        opened={opened}
        onClose={close}
        title={initialValues ? 'Edit MenuCycle' : 'Create MenuCycle'}
        position="right"
        closeOnClickOutside={false}
      >
        <MenuCycleForm initialValues={initialValues} />
      </Drawer>

      {initialValues ? (
        <UnstyledButton onClick={open}>
          <IconEdit size={25} />
        </UnstyledButton>
      ) : (
        <Button size="xs" onClick={open}>
          {'Add New'}
        </Button>
      )}
    </>
  );
}

export default MenuCycleFormDrawer;
