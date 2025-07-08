//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Button, Modal, Text, UnstyledButton } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useState } from 'react';

import { useNotifications } from '@/components/ui/core/notifications';
import { MealPreferenceResponse } from '@/interfaces/mess/meal-preference.interface';
import { useDeleteMealPreference } from '@/lib/api/mess/meal-preference/delete-meal-preference';

type DeleteMealPreferenceProps = {
  mealPreference?: MealPreferenceResponse;
};

export const DeleteMealPreference = ({
  mealPreference: targetedMealPreference,
}: DeleteMealPreferenceProps) => {
  const { addNotification } = useNotifications();
  const [opened, setOpened] = useState(false);

  const deleteMealPreferenceMutation = useDeleteMealPreference({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'MealPreference deleted',
        });
        setOpened(false);
      },
      onError: () => {
        addNotification({
          type: 'error',
          title: 'Failed to delete mealPreference',
        });
      },
    },
  });

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Delete MealPreference"
        centered
      >
        <Text>{`Are you sure you want to delete ${targetedMealPreference?._id} mealPreference?`}</Text>
        <Button
          mt="md"
          color="red"
          loading={deleteMealPreferenceMutation.isPending}
          onClick={() =>
            targetedMealPreference?._id &&
            deleteMealPreferenceMutation.mutate({
              mealPreferenceId: targetedMealPreference?._id,
            })
          }
          fullWidth
        >
          Confirm Delete
        </Button>
      </Modal>

      <UnstyledButton onClick={() => setOpened(true)}>
        <IconTrash size={25} />
      </UnstyledButton>
    </>
  );
};
