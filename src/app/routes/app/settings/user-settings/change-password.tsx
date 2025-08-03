//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { PasswordInput, Button, Flex } from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useEffect } from 'react';

import UserDropdown from '@/components/ui/core/dropdown/user-selector';
import { GenericFieldset } from '@/components/ui/core/fieldset/fieldset';
import { useNotifications } from '@/components/ui/core/notifications';
// import { ChangePasswordRequestZodSchema } from '@/interfaces/auth.interface';
import { UserRole } from '@/data/feature';
import { useLogout } from '@/lib/api/auth/auth';
import { AuthorizationService } from '@/lib/api/auth/authorization';
import { useChangePassword } from '@/lib/api/user/change-password';
import { useMe } from '@/lib/api/user/get-me';

const initialValues = {
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
  // unit: '',
  // organization: '',
  // user: '',
};

const ChangePasswordForm: React.FC = () => {
  const { data: me } = useMe();
  const form = useForm({
    initialValues,
    // validate: zodResolver(ChangePasswordRequestZodSchema),
  });
  const { addNotification } = useNotifications();
  const logout = useLogout({
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Password Changed Successfully',
        message: 'You have been logged out. Please log in again.',
      });
    },
  });

  const changePasswordMutation = useChangePassword({
    mutationConfig: {
      onSuccess: () => {
        form.reset();

        if (me?.data?._id === (form.values as any).user) {
          // If the user is changing their own password, log them out
          logout.mutate({});
        }

        addNotification({
          type: 'success',
          title: 'Password Changed Successfully',
        });
      },
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    // Add your API call or logic here

    changePasswordMutation.mutate({
      userId: (values as any).user ?? '', // Replace with actual user ID
      data: {
        oldPassword:
          me?.data?._id === (values as any).user
            ? values.oldPassword
            : undefined,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword,
      },
    });
  };

  useEffect(() => {
    if (!(form.values as any)?.user) form.setFieldValue('user', me?.data?._id);
    if (!(form.values as any)?.unit) form.setFieldValue('unit', me?.data?.unit);
    if (!(form.values as any)?.organization)
      form.setFieldValue('organization', me?.data?.organization);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values, me?.data]);

  return (
    <GenericFieldset legend="Change Password" radius="md" p="xl">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Flex direction={'column'} gap={'md'}>
          {AuthorizationService.hasEqualOrHigherRole(
            me?.data?.roles ?? [],
            UserRole.ADMIN,
          ) && <UserDropdown form={form} />}

          {(form.values as any)?.user === me?.data._id && (
            <PasswordInput
              label="Old Password"
              placeholder="Enter your old password"
              {...form.getInputProps('oldPassword')}
              required
            />
          )}
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
    </GenericFieldset>
  );
};

export default ChangePasswordForm;
