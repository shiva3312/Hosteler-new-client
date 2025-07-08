//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Button, Modal, Text, UnstyledButton } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useState } from 'react';

import { useNotifications } from '@/components/ui/core/notifications';
import { GroupResponse } from '@/interfaces/group.interface';
import { useDeleteGroup } from '@/lib/api/group/delete-group';

type DeleteGroupProps = {
  group?: GroupResponse;
};

export const DeleteGroup = ({ group: targetedGroup }: DeleteGroupProps) => {
  const { addNotification } = useNotifications();
  const [opened, setOpened] = useState(false);

  const deleteGroupMutation = useDeleteGroup({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Group deleted',
        });
        setOpened(false);
      },
      onError: () => {
        addNotification({
          type: 'error',
          title: 'Failed to delete group',
        });
      },
    },
  });

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Delete Group"
        centered
      >
        <Text>{`Are you sure you want to delete ${targetedGroup?.name} group?`}</Text>
        <Button
          mt="md"
          color="red"
          loading={deleteGroupMutation.isPending}
          onClick={() =>
            targetedGroup?._id &&
            deleteGroupMutation.mutate({
              groupId: targetedGroup?._id,
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
