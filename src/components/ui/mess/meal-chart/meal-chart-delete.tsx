//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Button, Modal, Text, UnstyledButton } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useState } from 'react';

import { useNotifications } from '@/components/ui/core/notifications';
import { MealChartResponse } from '@/interfaces/mess/meal-chart.interface';
import { useDeleteMealChart } from '@/lib/api/mess/meal-chart/delete-meal-chart';

type DeleteMealChartProps = {
  mealChart?: MealChartResponse;
};

export const DeleteMealChart = ({
  mealChart: targetedMealChart,
}: DeleteMealChartProps) => {
  const { addNotification } = useNotifications();
  const [opened, setOpened] = useState(false);

  const deleteMealChartMutation = useDeleteMealChart({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'MealChart deleted',
        });
        setOpened(false);
      },
      onError: () => {
        addNotification({
          type: 'error',
          title: 'Failed to delete mealChart',
        });
      },
    },
  });

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Delete MealChart"
        centered
      >
        <Text>{`Are you sure you want to delete ${targetedMealChart?.name} mealChart?`}</Text>
        <Button
          mt="md"
          color="red"
          loading={deleteMealChartMutation.isPending}
          onClick={() =>
            targetedMealChart?._id &&
            deleteMealChartMutation.mutate({
              mealChartId: targetedMealChart?._id,
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
