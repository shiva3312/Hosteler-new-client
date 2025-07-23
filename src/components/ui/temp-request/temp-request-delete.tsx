//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Button, Modal, Text, UnstyledButton } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useState } from 'react';

import { useNotifications } from '@/components/ui/core/notifications';
import { TempRequestResponse } from '@/interfaces/temp-request.interface';
import { useDeleteTempRequest } from '@/lib/api/temp-request/delete-temp-request';

type DeleteTempRequestProps = {
  tempRequest?: TempRequestResponse;
};

export const DeleteTempRequest = ({
  tempRequest: targetedTempRequest,
}: DeleteTempRequestProps) => {
  const { addNotification } = useNotifications();
  const [opened, setOpened] = useState(false);

  const deleteTempRequestMutation = useDeleteTempRequest({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'TempRequest deleted',
        });
        setOpened(false);
      },
      onError: () => {
        addNotification({
          type: 'error',
          title: 'Failed to delete tempRequest',
        });
      },
    },
  });

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Delete TempRequest"
        centered
      >
        <Text>{`Are you sure you want to delete ${targetedTempRequest?.name} tempRequest?`}</Text>
        <Button
          mt="md"
          color="red"
          loading={deleteTempRequestMutation.isPending}
          onClick={() =>
            targetedTempRequest?._id &&
            deleteTempRequestMutation.mutate({
              tempRequestId: targetedTempRequest?._id,
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
