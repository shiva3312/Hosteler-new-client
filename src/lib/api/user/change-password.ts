//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { z } from 'zod';

import { useNotifications } from '@/components/ui/core/notifications';
import { paths } from '@/config/paths';
import { ChangePasswordRequestZodSchema } from '@/interfaces/auth.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useLogout } from '../auth/auth';

export type ChangePasswordInput = z.infer<
  typeof ChangePasswordRequestZodSchema
>;

export const changePassword = ({
  userId,
  data,
}: {
  userId: string;
  data: ChangePasswordInput;
}) => {
  return api.put(`/user/change-password/${userId}`, data);
};

type UseChangePasswordOptions = {
  mutationConfig?: MutationConfig<typeof changePassword>;
};

export const useChangePassword = ({
  mutationConfig,
}: UseChangePasswordOptions = {}) => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const logout = useLogout({
    onSuccess: () => {
      addNotification({
        type: 'success',
        title: 'Password Changed Successfully',
        message: 'You have been logged out. Please log in again.',
      });
      navigate(paths.auth.login.getHref());
    },
  });

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      logout.mutate({});

      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: changePassword,
  });
};
