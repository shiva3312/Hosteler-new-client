//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { TextInput, Button, Drawer, UnstyledButton } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit } from '@tabler/icons-react';
import { isEmpty } from 'lodash';

import {
  MealItemRequest,
  MealItemResponse,
} from '@/interfaces/mess/meal-item.interface';
import { useCreateMealItem } from '@/lib/api/mess/meal-item/create-meal-item';
import { useUpdateMealItem } from '@/lib/api/mess/meal-item/update-meal-item';

import { useNotifications } from '../../core/notifications';

interface Props {
  initialValues?: Partial<MealItemResponse>;
}

function MealItemForm({ initialValues }: Props) {
  const form = useForm({
    initialValues,
    // validate : MealItemRequestZodSchema
  });
  const { addNotification } = useNotifications();

  const updateMealItemMutation = useUpdateMealItem({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'MealItem Updated',
        });
      },
    },
  });

  const createMealItemMutation = useCreateMealItem({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'MealItem Created',
        });
      },
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    if (isEmpty(initialValues)) {
      // validate the form values before proceeding

      // Handle create mealItem logic
      createMealItemMutation.mutate({
        data: values as MealItemRequest,
      });
      console.log('Creating mealItem with values:', values);
    } else {
      updateMealItemMutation.mutate({
        mealItemId: (initialValues as MealItemResponse)?._id,
        data: values as Partial<MealItemRequest>,
      });

      console.log('Updating mealItem with values:', values);
    }
    // Add logic to handle form submission, e.g., API call
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="MealItem Name"
        placeholder="Enter mealItem name"
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

function MealItemFormDrawer({ initialValues }: Props) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer
        size="xl"
        opened={opened}
        onClose={close}
        title={initialValues ? 'Edit MealItem' : 'Create MealItem'}
        position="right"
        closeOnClickOutside={false}
      >
        <MealItemForm initialValues={initialValues} />
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

export default MealItemFormDrawer;
