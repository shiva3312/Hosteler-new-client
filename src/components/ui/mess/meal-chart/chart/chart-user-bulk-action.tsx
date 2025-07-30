//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Button, Group } from '@mantine/core';
import { IconCircleOff, IconCircleCheck, IconTrash } from '@tabler/icons-react';

import { useNotifications } from '@/components/ui/core/notifications';
import {
  MealChartResponse,
  UpdateMealChartRequest,
} from '@/interfaces/mess/meal-chart.interface';
import { UserResponse } from '@/interfaces/user.interface';
import { useUpdateMealChart } from '@/lib/api/mess/meal-chart/update-meal-chart';

type BulkActionsProps = {
  mealChart: MealChartResponse;
  selectedRows: UserResponse[];
  onSuccess?: () => void;
};

export const MealChartUserBulkActions = ({
  selectedRows,
  mealChart,
  ...props
}: BulkActionsProps) => {
  const { addNotification } = useNotifications();

  const MealChartUserBulkAction = useUpdateMealChart({
    mutationConfig: {
      onSuccess: () => {
        if (props?.onSuccess) {
          props.onSuccess();
        }
        addNotification({
          type: 'success',
          title: 'Updated successfully',
        });
      },
      onError: (error) => {
        addNotification({
          type: 'error',
          title: 'Update failed',
          message: error.message,
        });
      },
    },
  });

  const handleBulkAction = (action: 'taken' | 'not-taken' | 'remove') => {
    switch (action) {
      case 'taken':
        // mark users as veified
        MealChartUserBulkAction.mutate({
          id: mealChart._id,
          data: {
            userWithMealPreference: mealChart.userWithMealPreference.map(
              (user) => {
                if (selectedRows.some((row) => row._id === user.user)) {
                  return {
                    ...user,
                    verify: true,
                  };
                }
                return user;
              },
            ),
          } as Partial<UpdateMealChartRequest>,
        });
        break;
      case 'not-taken':
        MealChartUserBulkAction.mutate({
          id: mealChart._id,
          data: {
            userWithMealPreference: mealChart.userWithMealPreference.map(
              (user) => {
                if (selectedRows.some((row) => row._id === user.user)) {
                  return {
                    ...user,
                    verify: false,
                  };
                }
                return user;
              },
            ),
          } as Partial<UpdateMealChartRequest>,
        });
        break;
      case 'remove':
        MealChartUserBulkAction.mutate({
          id: mealChart._id,
          data: {
            userWithMealPreference: mealChart.userWithMealPreference.filter(
              (user) => !selectedRows.some((row) => row._id === user.user),
            ),
          } as Partial<UpdateMealChartRequest>,
        });
        break;
    }
  };

  return (
    <Group>
      <Button
        color="green"
        variant="light"
        disabled={selectedRows.length === 0}
        leftSection={<IconCircleCheck size={16} />}
        onClick={() => handleBulkAction('taken')}
      >
        Mark Taken {selectedRows.length > 0 ? `(${selectedRows.length})` : ''}
      </Button>
      <Button
        color="gray"
        variant="light"
        disabled={selectedRows.length === 0}
        leftSection={<IconCircleOff size={16} />}
        onClick={() => handleBulkAction('not-taken')}
      >
        Mark Not Taken{' '}
        {selectedRows.length > 0 ? `(${selectedRows.length})` : ''}
      </Button>
      <Button
        color="red"
        variant="light"
        disabled={selectedRows.length === 0}
        leftSection={<IconTrash size={16} />}
        onClick={() => handleBulkAction('remove')}
      >
        Remove {selectedRows.length > 0 ? `(${selectedRows.length})` : ''}
      </Button>
    </Group>
  );
};
