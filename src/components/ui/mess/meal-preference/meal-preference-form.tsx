//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { TextInput, Button, Drawer, UnstyledButton } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit } from '@tabler/icons-react';
import { isEmpty } from 'lodash';

import {
  MealPreferenceRequest,
  MealPreferenceResponse,
} from '@/interfaces/mess/meal-preference.interface';
import { useCreateMealPreference } from '@/lib/api/mess/meal-preference/create-meal-preference';
import { useUpdateMealPreference } from '@/lib/api/mess/meal-preference/update-meal-preference';

import { useNotifications } from '../../core/notifications';

interface Props {
  initialValues?: Partial<MealPreferenceResponse>;
}

function MealPreferenceForm({ initialValues }: Props) {
  const form = useForm({
    initialValues,
    // validate : MealPreferenceRequestZodSchema
  });
  const { addNotification } = useNotifications();

  const updateMealPreferenceMutation = useUpdateMealPreference({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'MealPreference Updated',
        });
      },
    },
  });

  const createMealPreferenceMutation = useCreateMealPreference({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'MealPreference Created',
        });
      },
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    if (isEmpty(initialValues)) {
      // Handle create mealPreference logic
      createMealPreferenceMutation.mutate({
        data: values as MealPreferenceRequest,
      });
      console.log('Creating mealPreference with values:', values);
    } else {
      updateMealPreferenceMutation.mutate({
        mealPreferenceId: (initialValues as MealPreferenceResponse)?._id,
        data: values as MealPreferenceRequest,
      });

      console.log('Updating mealPreference with values:', values);
    }
    // Add logic to handle form submission, e.g., API call
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="MealPreference Name"
        placeholder="Enter mealPreference name"
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
        {initialValues ? 'Edit MealPreference' : 'Create MealPreference'}
      </Button>
    </form>
  );
}

// ----------------------
// Drawer wrapper component
// ----------------------

function MealPreferenceFormDrawer({ initialValues }: Props) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer
        size="xl"
        opened={opened}
        onClose={close}
        title={initialValues ? 'Edit MealPreference' : 'Create MealPreference'}
        position="right"
        closeOnClickOutside={false}
      >
        <MealPreferenceForm initialValues={initialValues} />
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

export default MealPreferenceFormDrawer;
