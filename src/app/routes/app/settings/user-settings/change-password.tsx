//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { PasswordInput, Button, Card, Flex } from '@mantine/core';
import { useForm } from '@mantine/form';
import React from 'react';

import { useNotifications } from '@/components/ui/core/notifications';
// import { ChangePasswordRequestZodSchema } from '@/interfaces/auth.interface';
import { useChangePassword } from '@/lib/api/user/change-password';
import { useMe } from '@/lib/api/user/get-me';

const initialValues = {
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};

const ChangePasswordForm: React.FC = () => {
  const form = useForm({
    initialValues,
    // validate: zodResolver(ChangePasswordRequestZodSchema),
  });
  const { addNotification } = useNotifications();
  const { data: me } = useMe();
  const changePasswordMutation = useChangePassword({
    mutationConfig: {
      onSuccess: () => {
        form.reset();
        addNotification({
          type: 'success',
          title: 'Password Changed Successfully',
        });
      },
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log('Form submitted:', values);
    // Add your API call or logic here
    changePasswordMutation.mutate({
      userId: me?.data._id ?? '', // Replace with actual user ID
      data: {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword,
      },
    });
  };

  return (
    <Card withBorder radius="md" p="xl">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Flex direction={'column'} gap={'md'}>
          <PasswordInput
            label="Old Password"
            placeholder="Enter your old password"
            {...form.getInputProps('oldPassword')}
            required
          />

          <PasswordInput
            label="New Password"
            placeholder="Enter your new password"
            {...form.getInputProps('newPassword')}
            required
          />

          <PasswordInput
            label="Confirm New Password"
            placeholder="Confirm your new password"
            {...form.getInputProps('confirmNewPassword')}
            required
          />

          <Flex justify={'end'}>
            <Button type="submit">Change Password</Button>
          </Flex>
        </Flex>
      </form>
    </Card>
  );
};

export default ChangePasswordForm;
