//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Button, Modal, Text, UnstyledButton } from '@mantine/core';
import { IconBan, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';

import { useNotifications } from '@/components/ui/core/notifications';
import { UserResponse } from '@/interfaces/user.interface';
import { useUser } from '@/lib/api/auth/auth';

import { useDeleteUser } from '../../../lib/api/user/delete-user';

type DeleteUserProps = {
  user?: UserResponse;
};

export const DeleteUser = ({ user: targetedUser }: DeleteUserProps) => {
  const user = useUser();
  const { addNotification } = useNotifications();
  const [opened, setOpened] = useState(false);

  const deleteUserMutation = useDeleteUser({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'User deleted',
        });
        setOpened(false);
      },
      onError: () => {
        addNotification({
          type: 'error',
          title: 'Failed to delete user',
        });
      },
    },
  });

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Delete User"
        centered
      >
        <Text>{`Are you sure you want to delete ${targetedUser?.username} user?`}</Text>
        <Button
          mt="md"
          color="red"
          loading={deleteUserMutation.isPending}
          onClick={() =>
            targetedUser?._id &&
            deleteUserMutation.mutate({ userId: targetedUser?._id })
          }
          fullWidth
        >
          Confirm Delete
        </Button>
      </Modal>

      <UnstyledButton
        disabled={user.data?._id === targetedUser?._id}
        onClick={() => setOpened(true)}
      >
        {user.data?._id === targetedUser?._id ? (
          <IconBan size={25} />
        ) : (
          <IconTrash size={25} />
        )}
      </UnstyledButton>
    </>
  );
};
