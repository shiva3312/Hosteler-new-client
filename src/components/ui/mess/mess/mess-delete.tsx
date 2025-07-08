//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Button, Modal, Text, UnstyledButton } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useState } from 'react';

import { useNotifications } from '@/components/ui/core/notifications';
import { MessResponse } from '@/interfaces/mess/mess.interface';
import { useDeleteMess } from '@/lib/api/mess/mess/delete-mess';

type DeleteMessProps = {
  mess?: MessResponse;
};

export const DeleteMess = ({ mess: targetedMess }: DeleteMessProps) => {
  const { addNotification } = useNotifications();
  const [opened, setOpened] = useState(false);

  const deleteMessMutation = useDeleteMess({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Mess deleted',
        });
        setOpened(false);
      },
      onError: () => {
        addNotification({
          type: 'error',
          title: 'Failed to delete mess',
        });
      },
    },
  });

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Delete Mess"
        centered
      >
        <Text>{`Are you sure you want to delete ${targetedMess?.name} mess?`}</Text>
        <Button
          mt="md"
          color="red"
          loading={deleteMessMutation.isPending}
          onClick={() =>
            targetedMess?._id &&
            deleteMessMutation.mutate({
              messId: targetedMess?._id,
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
