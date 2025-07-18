//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Button } from '@mantine/core';
import { Meta, StoryObj } from '@storybook/react';

import { ConfirmationDialog } from './confirmation-dialog';

const meta: Meta<typeof ConfirmationDialog> = {
  component: ConfirmationDialog,
};

export default meta;

type Story = StoryObj<typeof ConfirmationDialog>;

export const Danger: Story = {
  args: {
    icon: 'danger',
    title: 'Confirmation',
    body: 'Hello World',
    confirmButton: <Button className="bg-red-500">Confirm</Button>,
    triggerButton: <Button>Open</Button>,
  },
};

export const Info: Story = {
  args: {
    icon: 'info',
    title: 'Confirmation',
    body: 'Hello World',
    confirmButton: <Button>Confirm</Button>,
    triggerButton: <Button>Open</Button>,
  },
};
