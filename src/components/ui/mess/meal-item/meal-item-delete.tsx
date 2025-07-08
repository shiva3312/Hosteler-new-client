//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Button, Modal, Text, UnstyledButton } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useState } from 'react';

import { useNotifications } from '@/components/ui/core/notifications';
import { MealItemResponse } from '@/interfaces/mess/meal-item.interface';
import { useDeleteMealItem } from '@/lib/api/mess/meal-item/delete-meal-item';

type DeleteMealItemProps = {
  mealItem?: MealItemResponse;
};

export const DeleteMealItem = ({
  mealItem: targetedMealItem,
}: DeleteMealItemProps) => {
  const { addNotification } = useNotifications();
  const [opened, setOpened] = useState(false);

  const deleteMealItemMutation = useDeleteMealItem({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'MealItem deleted',
        });
        setOpened(false);
      },
      onError: () => {
        addNotification({
          type: 'error',
          title: 'Failed to delete mealItem',
        });
      },
    },
  });

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Delete MealItem"
        centered
      >
        <Text>{`Are you sure you want to delete ${targetedMealItem?.name} mealItem?`}</Text>
        <Button
          mt="md"
          color="red"
          loading={deleteMealItemMutation.isPending}
          onClick={() =>
            targetedMealItem?._id &&
            deleteMealItemMutation.mutate({
              mealItemId: targetedMealItem?._id,
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
