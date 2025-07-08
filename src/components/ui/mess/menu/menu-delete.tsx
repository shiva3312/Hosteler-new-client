//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Button, Modal, Text, UnstyledButton } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useState } from 'react';

import { useNotifications } from '@/components/ui/core/notifications';
import { MenuResponse } from '@/interfaces/mess/menu.interface';
import { useDeleteMenu } from '@/lib/api/mess/menu/delete-menu';

type DeleteMenuProps = {
  menu?: MenuResponse;
};

export const DeleteMenu = ({ menu: targetedMenu }: DeleteMenuProps) => {
  const { addNotification } = useNotifications();
  const [opened, setOpened] = useState(false);

  const deleteMenuMutation = useDeleteMenu({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Menu deleted',
        });
        setOpened(false);
      },
      onError: () => {
        addNotification({
          type: 'error',
          title: 'Failed to delete menu',
        });
      },
    },
  });

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Delete Menu"
        centered
      >
        <Text>{`Are you sure you want to delete ${targetedMenu?.name} menu?`}</Text>
        <Button
          mt="md"
          color="red"
          loading={deleteMenuMutation.isPending}
          onClick={() =>
            targetedMenu?._id &&
            deleteMenuMutation.mutate({
              menuId: targetedMenu?._id,
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
