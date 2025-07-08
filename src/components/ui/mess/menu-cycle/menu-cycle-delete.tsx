//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Button, Modal, Text, UnstyledButton } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useState } from 'react';

import { useNotifications } from '@/components/ui/core/notifications';
import { MenuCycleResponse } from '@/interfaces/mess/menu-cycle.interface';
import { useDeleteMenuCycle } from '@/lib/api/mess/menu-cycle/delete-menu-cycle';

type DeleteMenuCycleProps = {
  menuCycle?: MenuCycleResponse;
};

export const DeleteMenuCycle = ({
  menuCycle: targetedMenuCycle,
}: DeleteMenuCycleProps) => {
  const { addNotification } = useNotifications();
  const [opened, setOpened] = useState(false);

  const deleteMenuCycleMutation = useDeleteMenuCycle({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'MenuCycle deleted',
        });
        setOpened(false);
      },
      onError: () => {
        addNotification({
          type: 'error',
          title: 'Failed to delete menuCycle',
        });
      },
    },
  });

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Delete MenuCycle"
        centered
      >
        <Text>{`Are you sure you want to delete ${targetedMenuCycle?.name} menuCycle?`}</Text>
        <Button
          mt="md"
          color="red"
          loading={deleteMenuCycleMutation.isPending}
          onClick={() =>
            targetedMenuCycle?._id &&
            deleteMenuCycleMutation.mutate({
              menuCycleId: targetedMenuCycle?._id,
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
