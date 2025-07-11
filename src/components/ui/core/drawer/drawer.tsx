//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Button, Drawer, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ReactNode } from 'react';

import { DrawerTitle } from './drawer-title';

type GenericDrawerProps = {
  title: string;
  size?: string;
  position?: 'left' | 'right' | 'top' | 'bottom';
  trigger?: ReactNode;
  children: ReactNode;
};

export function GenericDrawer({
  title,
  size = 'xl',
  position = 'left',
  trigger,
  children,
}: GenericDrawerProps) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer
        // Apply the CSS module class for styling
        opened={opened}
        onClose={close}
        title={<DrawerTitle title={title} />}
        size={size}
        position={position}
        // closeOnClickOutside={false}
      >
        {children}
      </Drawer>

      {trigger ? (
        // If a custom trigger is passed (e.g., edit icon or button)
        <UnstyledButton onClick={open}>{trigger}</UnstyledButton>
      ) : (
        // Default trigger
        <Button onClick={open}>Open Drawer</Button>
      )}
    </>
  );
}
