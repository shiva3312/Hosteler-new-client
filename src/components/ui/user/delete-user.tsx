import { Button, Modal, Text, UnstyledButton } from '@mantine/core';
import { IconBan, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';

import { useNotifications } from '@/components/ui/core/notifications';
import { UserResponse } from '@/interfaces/user.interface';
import { useAuth } from '@/lib/api/auth/auth';

import { useUserBulkAction } from '@/lib/api/user/bulk-action';
import { GeneralAction } from '@/data/feature';

type DeleteUserProps = {
  users: UserResponse[]; // Now expects an array of users
  onSuccess?: () => void;
  variant?: 'compact' | 'default';
};

export const DeleteUser = ({
  users,
  onSuccess,
  variant = 'compact',
}: DeleteUserProps) => {
  const user = useAuth();
  const { addNotification } = useNotifications();
  const [opened, setOpened] = useState(false);
  // Prevent deleting yourself
  const filteredUsers = users?.filter((u) => u._id !== user.data?._id);

  const userBulkAction = useUserBulkAction({
    mutationConfig: {
      onSuccess: () => {
        if (onSuccess) {
          onSuccess();
        }
        addNotification({
          type: 'success',
          title: 'Updated successfully',
        });
      },
    },
  });

  const handelDeleteUsers = () => {
    userBulkAction.mutate({
      action: GeneralAction.DELETE,
      data: filteredUsers.map((s) => ({
        _id: s._id,
      })),
    });
    setOpened(false);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Delete Users"
        centered
      >
        {filteredUsers.length === 0 ? (
          <Text color="red">You cannot delete yourself.</Text>
        ) : (
          <>
            <Text>Are you sure you want to delete the following user(s)?</Text>
            {/* <ul style={{ margin: '12px 0' }}>
              {filteredUsers.map((u) => (
                <li key={u._id}>
                  <Text span fw={500}>
                    {u.username}
                  </Text>
                </li>
              ))}
            </ul> */}
            <Button
              mt="md"
              color="red"
              loading={userBulkAction.isPending}
              onClick={handelDeleteUsers}
              fullWidth
              disabled={filteredUsers.length === 0}
            >
              Confirm Delete
            </Button>
          </>
        )}
      </Modal>

      {variant === 'compact' ? (
        <UnstyledButton
          disabled={filteredUsers.length === 0}
          onClick={() => setOpened(true)}
          title={
            filteredUsers.length === 0
              ? 'You cannot delete yourself'
              : 'Delete selected users'
          }
        >
          {filteredUsers.length === 0 ? (
            <IconBan size={25} />
          ) : (
            <IconTrash size={25} />
          )}
        </UnstyledButton>
      ) : (
        <Button
          disabled={users.length === 0}
          color="red"
          variant="light"
          leftSection={<IconTrash size={16} />}
          onClick={() => setOpened(true)}
        >
          Delete {users.length > 0 ? `(${users.length})` : ''}
        </Button>
      )}
    </>
  );
};
