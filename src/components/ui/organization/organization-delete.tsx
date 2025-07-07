//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Button, Modal, Text, UnstyledButton } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useState } from 'react';

import { useNotifications } from '@/components/ui/core/notifications';
import { OrganizationResponse } from '@/interfaces/organization.interface';
import { useDeleteOrganization } from '@/lib/api/organization/delete-organization';

type DeleteOrganizationProps = {
  organization?: OrganizationResponse;
};

export const DeleteOrganization = ({
  organization: targetedOrganization,
}: DeleteOrganizationProps) => {
  const { addNotification } = useNotifications();
  const [opened, setOpened] = useState(false);

  const deleteOrganizationMutation = useDeleteOrganization({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Organization deleted',
        });
        setOpened(false);
      },
      onError: () => {
        addNotification({
          type: 'error',
          title: 'Failed to delete organization',
        });
      },
    },
  });

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Delete Organization"
        centered
      >
        <Text>{`Are you sure you want to delete ${targetedOrganization?.name} organization?`}</Text>
        <Button
          mt="md"
          color="red"
          loading={deleteOrganizationMutation.isPending}
          onClick={() =>
            targetedOrganization?._id &&
            deleteOrganizationMutation.mutate({
              organizationId: targetedOrganization?._id,
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
